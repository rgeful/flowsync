import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { flows, executions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { executeActions } from "@/lib/workflow/executor";

// Simple cron expression matcher for current minute
function shouldRunNow(cronExpression: string): boolean {
  const now = new Date();
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cronExpression.split(" ");

  const matches = (field: string, value: number): boolean => {
    if (field === "*") return true;
    if (field.includes("/")) {
      const [, step] = field.split("/");
      return value % parseInt(step) === 0;
    }
    if (field.includes(",")) {
      return field.split(",").map(Number).includes(value);
    }
    return parseInt(field) === value;
  };

  return (
    matches(minute, now.getUTCMinutes()) &&
    matches(hour, now.getUTCHours()) &&
    matches(dayOfMonth, now.getUTCDate()) &&
    matches(month, now.getUTCMonth() + 1) &&
    matches(dayOfWeek, now.getUTCDay())
  );
}

export async function GET(request: NextRequest) {
  // Verify cron secret
  const key = request.nextUrl.searchParams.get("key");
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all active flows
    const activeFlows = await db.query.flows.findMany({
      where: eq(flows.isActive, true),
    });

    const results = [];

    for (const flow of activeFlows) {
      // Check if this flow should run now
      if (!shouldRunNow(flow.cronExpression)) {
        continue;
      }

      // Create execution record
      const [execution] = await db
        .insert(executions)
        .values({
          flowId: flow.id,
          status: "pending",
        })
        .returning();

      try {
        // Execute the flow actions
        const actions = flow.actions as Array<{
          integration: "telegram" | "github" | "coingecko" | "webhook" | "ai_generate";
          method: "GET" | "POST";
          endpoint: string | null;
          payload: {
            message: string | null;
            chatId: string | null;
            coin: string | null;
            repo: string | null;
            url: string | null;
            prompt: string | null;
          };
        }>;

        const logs = await executeActions(actions);
        const allSuccess = logs.every((log) => log.success);

        // Update execution record
        await db
          .update(executions)
          .set({
            status: allSuccess ? "success" : "failed",
            logs,
            completedAt: new Date(),
          })
          .where(eq(executions.id, execution.id));

        results.push({
          flowId: flow.id,
          flowName: flow.name,
          status: allSuccess ? "success" : "failed",
          logs,
        });
      } catch (error) {
        // Update execution as failed
        await db
          .update(executions)
          .set({
            status: "failed",
            logs: [{ error: error instanceof Error ? error.message : "Unknown error" }],
            completedAt: new Date(),
          })
          .where(eq(executions.id, execution.id));

        results.push({
          flowId: flow.id,
          flowName: flow.name,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      executed: results.length,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

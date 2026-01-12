import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { flows, executions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { executeActions } from "@/lib/workflow/executor";

// Manual trigger for a specific flow - bypasses cron check
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const flow = await db.query.flows.findFirst({
      where: eq(flows.id, id),
    });

    if (!flow) {
      return NextResponse.json({ error: "Flow not found" }, { status: 404 });
    }

    // Create execution record
    const [execution] = await db
      .insert(executions)
      .values({
        flowId: flow.id,
        status: "pending",
      })
      .returning();

    // Execute the flow actions
    const actions = flow.actions as Array<{
      integration: "telegram" | "github" | "coingecko" | "webhook";
      method: "GET" | "POST";
      endpoint: string | null;
      payload: {
        message: string | null;
        chatId: string | null;
        coin: string | null;
        repo: string | null;
        url: string | null;
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

    return NextResponse.json({
      flowId: flow.id,
      flowName: flow.name,
      status: allSuccess ? "success" : "failed",
      logs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

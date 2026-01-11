"use server";

import { db } from "@/lib/db";
import { flows } from "@/lib/db/schema";
import { parseUserInput } from "@/lib/ai/openai";
import { eq } from "drizzle-orm";

// Parses user input with AI and saves it to DB
export async function createFlow(userId: string, prompt: string) {
  const parsed = await parseUserInput(prompt);
  
  const [flow] = await db
    .insert(flows)
    .values({
      userId,
      name: parsed.name,
      prompt,
      cronExpression: parsed.cron,
      actions: parsed.actions,
      isActive: true,
    })
    .returning();

  return flow;
}

// Gets all flows for a user
export async function getFlows(userId: string) {
  return db.query.flows.findMany({
    where: eq(flows.userId, userId),
    orderBy: (flows, { desc }) => [desc(flows.createdAt)],
  });
}

// Gets a single flow by ID
export async function getFlowById(id: string) {
  return db.query.flows.findFirst({
    where: eq(flows.id, id),
  });
}

// Enable or disable a flow
export async function toggleFlow(id: string, isActive: boolean) {
  const [flow] = await db
    .update(flows)
    .set({ isActive })
    .where(eq(flows.id, id))
    .returning();

  return flow;
}

// Deletes flow
export async function deleteFlow(id: string) {
  await db.delete(flows).where(eq(flows.id, id));
}

import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { SYSTEM_PROMPT } from "./prompts";

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
});

// Schema for the parsed flow output
const ActionSchema = z.object({
  integration: z.enum(["telegram", "github", "coingecko", "webhook"]),
  method: z.enum(["GET", "POST"]),
  endpoint: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
});

export const FlowSchema = z.object({
  name: z.string(),
  cron: z.string(),
  actions: z.array(ActionSchema),
});

export type ParsedFlow = z.infer<typeof FlowSchema>;

export async function parseUserInput(userPrompt: string): Promise<ParsedFlow> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ],
    response_format: zodResponseFormat(FlowSchema, "flow"),
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No response from OpenAI");
  }

  return FlowSchema.parse(JSON.parse(content));
}
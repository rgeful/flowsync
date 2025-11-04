import OpenAI from "openai";
import type { Plan } from "./types";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const schema = {
  type:"object",
  properties:{
    summary:{type:"string"},
    frequency:{type:"string",enum:["once","daily","weekly","monthly"]},
    time:{type:"string"},
    day_of_week:{type:"number"},
    day_of_month:{type:"number"},
    action:{type:"string",enum:["webhook","telegram"]},
    payload:{type:"object",properties:{
      url:{type:"string"}, message:{type:"string"}, chat_id:{type:"string"}
    }}
  },
  required:["summary","frequency","action","payload"]
} as const;

export async function parseInstruction(nl: string): Promise<Plan> {
  const res = await client.responses.create({
    model: "gpt-4.1-mini",
    system:
      "Parse natural-language automation into strict JSON. Default time=09:00, Monday for weekly, day 1 for monthly.",
    input: nl,
    response_format: { type: "json_schema", json_schema: { name:"plan", schema } },
    temperature: 0.2
  });
  return JSON.parse(res.output_text!) as Plan;
}

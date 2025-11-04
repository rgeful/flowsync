export type Frequency = "once"|"daily"|"weekly"|"monthly";
export type Plan = {
  summary: string;
  frequency: Frequency;
  time?: string;            // "09:00"
  day_of_week?: number;     // 0-6
  day_of_month?: number;    // 1-31
  action: "webhook"|"telegram";
  payload: { url?: string; message?: string; chat_id?: string; };
};
export type Task = {
  id: string;
  summary: string;
  plan: Plan;
  created_at: string;
  next_run: string;         // ISO
  active: boolean;
};

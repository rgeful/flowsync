const TELEGRAM_API = "https://api.telegram.org/bot";

type TelegramPayload = {
  message: string | null;
  chatId: string | null;
};

export async function sendTelegramMessage(payload: TelegramPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    throw new Error("TELEGRAM_BOT_TOKEN not configured");
  }

  if (!payload.chatId || !payload.message) {
    throw new Error("Missing chatId or message in payload");
  }

  const response = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: payload.chatId,
      text: payload.message,
      parse_mode: "HTML",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Telegram API error: ${error}`);
  }

  return response.json();
}

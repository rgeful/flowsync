import { sendTelegramMessage } from "@/lib/integrations/telegram";
import { getCoinPrice } from "@/lib/integrations/coingecko";

type Action = {
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
};

type ExecutionLog = {
  action: string;
  success: boolean;
  result?: unknown;
  error?: string;
};

export async function executeActions(actions: Action[]): Promise<ExecutionLog[]> {
  const logs: ExecutionLog[] = [];
  const context: Record<string, unknown> = {};

  for (const action of actions) {
    try {
      let result: unknown;

      switch (action.integration) {
        case "coingecko": {
          const coinData = await getCoinPrice(action.payload);
          context.coinMessage = coinData.message;
          context.coinPrice = coinData.price;
          result = coinData;
          break;
        }

        case "telegram": {
          // Use coin message from context if no message specified
          const message = action.payload.message || (context.coinMessage as string);
          result = await sendTelegramMessage({
            ...action.payload,
            message,
          });
          break;
        }

        case "webhook": {
          if (!action.payload.url) {
            throw new Error("Webhook URL required");
          }
          const res = await fetch(action.payload.url, {
            method: action.method,
            headers: { "Content-Type": "application/json" },
            body: action.method === "POST" ? JSON.stringify(context) : undefined,
          });
          result = await res.json();
          break;
        }

        case "github": {
          // TODO: Implement GitHub integration
          throw new Error("GitHub integration not yet implemented");
        }

        default:
          throw new Error(`Unknown integration: ${action.integration}`);
      }

      logs.push({
        action: action.integration,
        success: true,
        result,
      });
    } catch (error) {
      logs.push({
        action: action.integration,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return logs;
}

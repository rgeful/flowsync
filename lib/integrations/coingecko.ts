const COINGECKO_API = "https://api.coingecko.com/api/v3";

type CoinGeckoPayload = {
  coin: string | null;
};

export async function getCoinPrice(payload: CoinGeckoPayload) {
  const coin = payload.coin || "bitcoin";

  const apiKey = process.env.COINGECKO_API_KEY;
  const headers: HeadersInit = apiKey ? { "x-cg-demo-api-key": apiKey } : {};

  const response = await fetch(
    `${COINGECKO_API}/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`,
    { headers }
  );

  if (!response.ok) {
    throw new Error(`CoinGecko API error: ${response.statusText}`);
  }

  const data = await response.json();
  const price = data[coin]?.usd;
  const change = data[coin]?.usd_24h_change?.toFixed(2);

  if (!price) {
    throw new Error(`Coin "${coin}" not found`);
  }

  return {
    coin,
    price,
    change,
    message: `${coin.toUpperCase()}: $${price.toLocaleString()} (${change >= 0 ? "+" : ""}${change}% 24h)`,
  };
}

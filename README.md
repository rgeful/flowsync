# FlowSync

A natural-language automation builder that converts English text into scheduled workflows.

## How It Works

1. **Describe your automation** in plain English (e.g., "Send me Bitcoin price on Telegram every morning at 9am")
2. **AI parses** your request into a structured workflow (cron schedule + actions)
3. **Vercel Cron** triggers the workflow on schedule
4. **Actions execute** in sequence (fetch data → send notification)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL (Supabase) + Drizzle ORM
- **AI:** GPT-4o (OpenAI) for natural language parsing
- **Scheduling:** Vercel Cron
- **Styling:** Tailwind CSS

## Features

- Natural language flow creation
- Telegram notifications
- CoinGecko price fetching
- Manual "Run Now" trigger
- Pause/Resume flows
- Execution logging

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd flowsync
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in:

```
DATABASE_URL=your-supabase-postgres-url
OPEN_AI_API_KEY=your-openai-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
COINGECKO_API_KEY=your-coingecko-api-key
CRON_SECRET=any-random-secret
```

### 3. Run database migrations

```bash
npx drizzle-kit push
```

### 4. Start development server

```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
flowsync/
├── app/
│   ├── (dashboard)/        # Dashboard pages
│   └── api/
│       └── flow/
│           ├── run/        # Cron endpoint (all flows)
│           └── [id]/run/   # Manual trigger (single flow)
├── actions/
│   └── flows.ts            # Server actions for CRUD
├── components/
│   └── dashboard/          # UI components
├── lib/
│   ├── ai/                 # GPT-4o parser + prompts
│   ├── db/                 # Drizzle schema + connection
│   ├── integrations/       # Telegram, CoinGecko
│   └── workflow/           # Action executor
```

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/flow/run?key=SECRET` | GET | Cron - run all due flows |
| `/api/flow/[id]/run` | POST | Manual - run single flow |

## Creating Flows

Example prompts:
- "Send me Bitcoin price on Telegram (chat ID: 123456) every morning at 9am"
- "Check Ethereum price and message me on Telegram every hour"
- "Send a daily reminder at 5pm to my Telegram"

## License

MIT

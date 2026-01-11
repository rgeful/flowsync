# Project Overview: FlowSync
**Mission:** A natural-language automation builder that converts English text into scheduled workflows.
**Core Loop:** User Input (NL) → GPT-4o Parser → Structured Data (Supabase) → Vercel Cron → Webhook Execution.

## Core Concepts
- **"Flow":** A single automation entry (e.g., "Post random motivational quote to Twitter every Monday").
- **"Parser":** The GPT-4o logic that converts unstructured text into JSON (schedule + action payload).
- **"Executor":** The server-side logic triggered by Cron to fire the actual webhooks.

---

# Tech Stack & Architecture
- **Framework:** Next.js (App Router)
- **Database:** Supabase (PostgreSQL)
- **AI Model:** GPT-4o (via OpenAI SDK)
- **Infrastructure:** Vercel (Hosting + Vercel Cron)
- **Execution:** Custom webhook engine

## Architecture Rules
1. **Frontend:** Client components for the UI; Server Actions for data mutation.
2. **Parsing:** All prompt engineering logic lives in `/lib/ai`.
3. **Scheduling:** Vercel Cron hits a secured API route (`/api/cron`) which checks Supabase for due tasks.
4. **Security:** All webhook execution routes must verify a secret key to prevent unauthorized triggering.

---

# Development Commands
## Build & Run
- **Start Dev Server:** `npm run dev`
- **Build for Prod:** `npm run build`
- **Run Linter:** `npm run lint`

---

# Coding Standards
- **Language:** TypeScript (Strict mode).
- **Styling:** Tailwind CSS.
- **Async Logic:**
  - AI parsing can be slow; use optimistic UI updates where possible.
  - Webhook execution must handle timeouts and 3rd-party API failures gracefully.
- **Environment Variables:**
  - I have all in .env.example

# Important Implementation Notes
- **Timezones:** Store all schedules in UTC in the database. Convert to user local time only on the frontend.
- **Rate Limits:** When testing the "Executor", be mindful of OpenAI and 3rd-party API rate limits.
# TrialBridge India — Full Build Plan

The imported project is the blank Lovable template, so this builds the whole app from scratch plus your 8 changes. The Claude API key stays on the server — never in the browser bundle.

## Architecture

Multi-page TanStack Start app with a shared fixed navbar. Pages, not scroll sections:

- `/` — Home (hero, how-it-works, stats)
- `/find-trials` — Search form + results from ClinicalTrials.gov
- `/faq` — Accordion FAQ
- `/about` — Team + vision
- `/assistant` — Claude-powered chat
- `/contact` — Contact info

Navbar links use TanStack `<Link>` (not hash anchors). Mobile gets a hamburger sheet with the same links vertically. Footer is shared across all pages.

## Design system

Green medical theme defined in `src/styles.css` as oklch tokens (no hardcoded hex in components):
- Primary green ~ `#2d7a4f` (dark green) for footer, buttons, headings
- Soft green surface ~ `#f0faf4` for alt rows, About background, simplified-summary box
- White cards, subtle shadows, rounded-xl
- Logo: green rounded square (primary), white stethoscope icon (lucide), "TrialBridge India" bold + "Clinical Trial Discovery Platform" subtitle. Reused in navbar and footer.

## Find Trials — real ClinicalTrials.gov integration

- Search form: condition, age, gender, city (all optional except condition).
- Calls ClinicalTrials.gov v2 API (`https://clinicaltrials.gov/api/v2/studies`) filtered by `query.cond`, `query.locn=India`, `filter.overallStatus=RECRUITING`. This is a public API, no key needed, called directly from the browser.
- Match scoring algorithm (0–100) weighing: condition keyword match (40), age within eligibility range (25), gender match (15), city in locations (20). Clearly labeled "Match Score".
- Trial card shows: title, phase, hospital + city, brief description, match score badge, expandable eligibility, and three actions: **Patient Friendly Summary**, **Register Interest** (modal collecting name + phone, stored locally for now — no DB), **Share on WhatsApp** (deep link).

## Claude integration — secure server routes

Enable Lovable Cloud → store `ANTHROPIC_API_KEY` as a server secret you paste in (never committed). Add two TanStack server routes (browser → our server → Anthropic):

- `POST /api/simplify` — body `{ trial }`, server constructs the patient-friendly prompt with your exact emoji structure, calls `claude-sonnet-4-5` (corrected; `claude-sonnet-4-6` does not exist — I'll use the latest Sonnet), returns `{ text }`.
- `POST /api/chat` — body `{ messages }`, server prepends the TrialBridge Assistant system prompt and 80-word rule, returns `{ text }`.

Frontend calls `/api/simplify` and `/api/chat` — no API key, no `anthropic-dangerous-direct-browser-access` header. Same UX you described: green spinner + "AI is simplifying this trial for you...", green-themed result box, typing-dots animation in chat, full conversation history retained client-side, seeded greeting message.

I will NOT create `src/config.ts` with a hardcoded key — that would expose it publicly. This is a hard line; the server-route approach gives identical functionality safely.

## The 8 Changes (mapped)

1. Navbar — fixed top, logo left, 6 links right, hamburger on mobile, smooth route transitions.
2. Patient Friendly Summary — calls `/api/simplify`, green spinner, green result box.
3. AI Chat — calls `/api/chat` with full history, typing dots, seeded greeting.
4. About page — soft-green bg, vision card, dark-green vision box with your exact copy.
5. FAQ page — accordion with all 10 Q&As verbatim, alternating white / `#f0faf4` rows, green chevron rotates on expand.
6. Contact page — heading, mailto link to trialbridge.india@gmail.com, helper line pointing to assistant/search.
7. Footer — `#2d7a4f` bg, white text "TrialBridge India © 2026" + data-source disclaimer. No Bolt/Lovable mentions.
8. Hide platform badges — CSS rules added to `src/styles.css`.

## What I will NOT do

- Hardcode the Claude key in `src/config.ts` or anywhere client-side.
- Store patient health data in any database (your privacy promise in FAQ #10). Register-interest form just shows a confirmation; you can wire email/SMS delivery later.
- Add hash-anchor single-page scroll — your last instruction said separate pages, which matches good SEO too.

## Technical notes

- `src/lib/anthropic.server.ts` — server-only Claude client.
- `src/routes/api/simplify.ts`, `src/routes/api/chat.ts` — POST handlers; read `process.env.ANTHROPIC_API_KEY` inside the handler.
- `src/lib/clinical-trials.ts` — browser-safe ClinicalTrials.gov fetcher + match scorer (pure, easy to test).
- `src/components/site/{Navbar,Footer,Logo,TrialCard,SimplifiedSummary,RegisterInterestModal}.tsx`.
- `src/routes/{index,find-trials,faq,about,assistant,contact}.tsx` with proper `head()` metadata per route (distinct titles/descriptions for SEO).
- Sitemap + robots.txt with all 6 routes.

## After build

You'll be prompted to: (a) paste your **new** Anthropic key into the `ANTHROPIC_API_KEY` secret, (b) set an Anthropic spend cap as a safety net.

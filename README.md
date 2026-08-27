# PesaRate — Financial Intelligence Workspace

PesaRate is a React + Vite app for understanding currency conversion in context. It's built
around one question: **"How much is my money worth, and what does that actually mean?"**

A plain converter tells you a number. PesaRate wraps that number in the context a person
actually needs before moving or spending money: the live mid-market rate, a watchlist with
target-rate alerts, a travel budget planner, destination/currency exploration, and short,
practical explainers on what rate movement means for real decisions.

## Design direction

The UI follows an "exchange bureau" concept rather than a generic SaaS dashboard: a dark
ink background, banknote-inspired accent colours (marigold, coral, lime) used the way currency
notes use colour-coding, ticket-style cards with a perforated/denomination motif, and a live
departure-board-style rate ticker as the signature element. Type pairs a display serif
(Fraunces) with Inter for UI text and JetBrains Mono for all rate/amount figures.

## Features

- Live currency conversion (Dashboard quick-convert + full Convert page)
- Decision context around rates and provider markups
- Saved conversions, persisted to `localStorage`
- Currency watchlist with target-rate alerts, persisted to `localStorage`
- Travel money planner with a suggested spending split
- Destination/currency exploration with live weather context
- Practical financial insights
- Explicit loading, error (with retry), and empty states on every data-driven page

## Setup

```bash
npm install
npm run dev      # starts the Vite dev server
```

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build
npm run lint      # ESLint
```

Requires Node 18+. No API keys or environment variables are needed — every external API
used is public and unauthenticated.

## APIs used

| API | Used for | Endpoint |
|---|---|---|
| [open.er-api.com](https://www.exchangerate-api.com/docs/free) | Live mid-market rates | `GET /v6/latest/{base}` |
| [Frankfurter](https://frankfurter.dev) | Historical rate ranges (ECB-tracked currencies) | `GET /v1/{start}..{end}?base=&symbols=` |
| [REST Countries](https://restcountries.com) | Country/currency metadata for Explore | `GET /v3.1/currency/{code}` |
| [Open-Meteo](https://open-meteo.com) | Travel weather context | `GET /v1/forecast?latitude=&longitude=&current=` |

All calls live in `src/api.js`, each with its own error handling so one failing source
never breaks the rest of the page.

## Project structure

```
src/
  api.js               API calls
  hooks/                useRates (loading/error/ready), useLocalCollection (saved data)
  components/           Card, DataState (loading/error/empty), PageHeader, CurrencyField, RateTicker
  layout/                AppShell, Sidebar, MobileNav
  pages/                 One file per route
```

## Known limitations

- Frankfurter doesn't track KES, so historical trend charts are only available for
  ECB-tracked currency pairs; `getHistoricalRange` returns `null` for unsupported pairs
  rather than fabricating data.
- Saved conversions and watchlist alerts are stored in `localStorage`, so they're local
  to one browser and aren't shared across devices. This is by design for the Phase 1
  React-only scope — Phase 2 replaces this with a Flask + PostgreSQL backend behind
  user accounts (see `/backend`).
- Rate alerts are stored but not actively evaluated against live rates yet (no push/email
  notification); the Phase 2 backend is where alert-checking logic belongs.
- Public APIs used here are unauthenticated and can be rate-limited under heavy use;
  `useRates` surfaces this as a retryable error state rather than a silent failure.

## Deployment

Configured for Vercel via `vercel.json` (SPA rewrite to `index.html`).

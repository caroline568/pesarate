# PesaRate — Financial Intelligence Workspace (Phase 2: full-stack)

PesaRate helps people understand currency conversion in context, not just get a number:
live mid-market rates, decision context around provider markups, a currency watchlist with
target-rate alerts, a travel money planner, destination/currency exploration, and short
practical explainers — now backed by real user accounts so saved conversions and alerts
persist and sync across devices.

This is the Phase 2 extension of the original Phase 1 React prototype: the same frontend,
now talking to a Flask + PostgreSQL API (`/backend`) for auth and persistence, per the
"React Prototype → Full-Stack Product" architecture in the PesaRate pitch deck.

## Design direction

An "exchange bureau" concept rather than a generic SaaS dashboard: dark ink background,
banknote-inspired accent colours (marigold, coral, lime) used the way currency notes use
colour-coding, ticket-style cards with a perforated/denomination motif, and a live
departure-board-style rate ticker as the signature element. Fraunces (display) + Inter (UI)
+ JetBrains Mono (all rate/amount figures).

## Running it locally

**Backend** (see `backend/README.md` for full detail):
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
python run.py                 # http://localhost:5000
```

**Frontend**, in a second terminal:
```bash
cp .env.example .env          # VITE_API_URL, defaults to http://localhost:5000/api
npm install
npm run dev                    # http://localhost:5173
```

```bash
npm run build     # production build to dist/
npm run lint      # ESLint
```

## Auth & persistence model

- Sign up / sign in issues a JWT (`Flask-JWT-Extended`), stored in `localStorage`.
- Signed in: saved conversions and rate alerts are read/written through the Flask API,
  scoped to the current user (`user_id` on every row; every route enforces ownership and
  returns `404` — not `403` — for another user's record).
- Signed out: the same features still work, falling back to `localStorage` only, so the
  app is fully usable without an account. Both the Dashboard and Watchlist show a small
  "Sign in to sync across devices" hint in that mode.

## Features

- Live currency conversion (Dashboard quick-convert + full Convert page)
- Decision context around rates and provider markups
- Saved conversions and a currency watchlist with target-rate alerts (see persistence model above)
- Travel money planner with a suggested spending split
- Destination/currency exploration with live weather context
- Practical financial insights
- Explicit loading, error (with retry), and empty states on every data-driven page

## APIs used (frontend)

| API | Used for | Endpoint |
|---|---|---|
| [open.er-api.com](https://www.exchangerate-api.com/docs/free) | Live mid-market rates | `GET /v6/latest/{base}` |
| [Frankfurter](https://frankfurter.dev) | Historical rate ranges (ECB-tracked currencies) | `GET /v1/{start}..{end}?base=&symbols=` |
| [REST Countries](https://restcountries.com) | Country/currency metadata for Explore | `GET /v3.1/currency/{code}` |
| [Open-Meteo](https://open-meteo.com) | Travel weather context | `GET /v1/forecast?latitude=&longitude=&current=` |

See `backend/README.md` for the PesaRate API's own endpoints.

## Project structure

```
src/
  api.js                 External (public) API calls
  api-client.js           Calls into the PesaRate Flask API
  context/AuthContext.jsx  Auth state, JWT storage
  hooks/                   useRates, useSavedConversions, useRateAlerts, useAuth
  components/              Card, DataState, PageHeader, CurrencyField, RateTicker
  layout/                  AppShell, Sidebar, MobileNav
  pages/                   One file per route (incl. Login/Signup)
backend/
  app/                     Flask app factory, models, routes
  migrations/               Alembic migrations
  tests/manual_smoke_test.sh
```

## Known limitations

- Frankfurter doesn't track KES, so historical trend charts are only available for
  ECB-tracked currency pairs.
- Rate alerts are stored (and can be toggled active/inactive) but nothing yet evaluates
  them against live rates to notify a user — see `backend/README.md`.
- Public market-data APIs are unauthenticated and can be rate-limited under heavy use;
  `useRates` surfaces this as a retryable error state rather than failing silently.
- JWTs are valid for 7 days with no revocation list — acceptable for a course project,
  not for a production deployment.

## Deployment

Frontend is configured for Vercel (`vercel.json`, SPA rewrite). Backend is a standard
Flask app (`gunicorn run:app`) deployable anywhere that can reach a PostgreSQL database
(Render, Railway, Supabase + any host, etc.) — set `DATABASE_URL`, `SECRET_KEY`,
`JWT_SECRET_KEY`, and `CORS_ORIGINS` as environment variables there.

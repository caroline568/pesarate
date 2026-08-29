# PesaRate API (Phase 2 backend)

Flask + PostgreSQL backend that gives the PesaRate React app persistence, user accounts,
and ownership-scoped saved conversions and rate alerts — the "Phase 2 Application" extension
described in the PesaRate pitch deck.

## Stack

- Flask 3, application-factory pattern (`app/__init__.py`)
- Flask-SQLAlchemy + Flask-Migrate (Alembic) for the ORM and schema migrations
- Flask-JWT-Extended for stateless auth (bearer tokens)
- Flask-CORS, scoped to `/api/*` and the configured frontend origin
- PostgreSQL in production (Supabase-compatible), SQLite by default for zero-setup local dev

## Data model

```
User (id, email, password_hash, name)
  └─< SavedConversion (id, user_id, from_currency, to_currency, amount, rate, converted_value, created_at)
  └─< RateAlert        (id, user_id, from_currency, to_currency, target_rate, active, created_at)
```

Every conversion and alert belongs to exactly one user. Every read/update/delete route
filters by the authenticated user's id, and returns `404` (not `403`) for another user's
record, so a request can't be used to confirm that a record exists.

## Setup

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # fill in SECRET_KEY / JWT_SECRET_KEY / DATABASE_URL

flask db upgrade             # creates the schema (sqlite by default)
python run.py                 # http://localhost:5000
```

To use Supabase/Postgres instead of the local SQLite fallback, set `DATABASE_URL` in `.env`
to your connection string, then re-run `flask db upgrade`.

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create an account, returns a JWT |
| POST | `/api/auth/login` | – | Returns a JWT |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/conversions?page=&per_page=` | ✓ | Paginated list of the caller's saved conversions |
| POST | `/api/conversions` | ✓ | Create a saved conversion |
| DELETE | `/api/conversions/<id>` | ✓ | Delete a saved conversion (owner only) |
| GET | `/api/alerts` | ✓ | List the caller's rate alerts |
| POST | `/api/alerts` | ✓ | Create a rate alert |
| PATCH | `/api/alerts/<id>` | ✓ | Update `target_rate` / `active` (owner only) |
| DELETE | `/api/alerts/<id>` | ✓ | Delete an alert (owner only) |
| GET | `/api/health` | – | Liveness check |

Authenticated routes expect `Authorization: Bearer <token>`. Every error response is
`{"error": "message"}` with an appropriate status code (400/401/404/422/500), handled
centrally in `app/__init__.py`.

## Verified manually

Registration, duplicate-email rejection, login, `/me`, unauthenticated `401`, conversion
and alert CRUD, and cross-user ownership enforcement (a second user gets an empty list and
a `404` on another user's record id) were all exercised against a local SQLite database
before this was handed off — see the commands in `tests/manual_smoke_test.sh`.

## Known challenges / open items

- Alerts are stored and can be marked `active`/inactive, but there's no background job
  yet that checks live rates against `target_rate` and notifies the user — that's the
  natural next step once a notification channel (email/push) is chosen.
- JWTs aren't revocable before expiry (7 days) since there's no token blocklist; fine for
  a course project, worth adding (e.g. Redis-backed blocklist) before any real deployment.
- No rate limiting on `/api/auth/*`, which a public deployment would want.

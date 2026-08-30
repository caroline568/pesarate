# PesaRate — Phase 2 rebuild

PesaRate is a full-stack currency and travel-money workspace designed to match the supplied PesaRate product mock: a compact light dashboard, deep-blue sidebar, green actions, live KES rates, saved conversions, trips, trends/news, alerts, and profile management.

## What is included

- **Landing / Sign in** — one tabbed experience for login and sign-up.
- **Dashboard** — live KES rates from ExchangeRate-API, recent saved conversions, upcoming trips sorted by travel date, and active alerts.
- **Convert** — live conversion, provider/channel selection, saved conversion CRUD, and edit support through `PATCH`.
- **Trips** — full CRUD against `/api/trips`, live KES conversion, and countdown from `travel_date`.
- **Trends & News** — historical chart logic combined with editorial financial context in a two-panel layout.
- **Alerts** — backend `from_currency` / `to_currency` model, create/edit/delete, and active/paused toggle.
- **Profile** — profile editing with avatar, account statistics, saved trips overview, logout, and account deletion.

The old Explore/Country Detail, Monitor, TravelMoney, Rates, News, Login and Signup pages are intentionally removed from the frontend route tree because they are replaced by the new experience.

## Stack

- React + Vite
- Tailwind CSS
- Flask
- Flask-SQLAlchemy + Alembic/Flask-Migrate
- JWT authentication
- PostgreSQL/Supabase in production, SQLite fallback for local development
- Recharts for historical trends

## Run locally

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
flask db upgrade
python run.py
```

Backend runs at `http://localhost:5000`.

### Frontend

In a second terminal:

```bash
cp .env.example .env
npm install
npm run dev
```

Frontend runs at the Vite URL shown in the terminal, normally `http://localhost:5173`.

Set `VITE_API_URL` when the Flask backend is deployed somewhere other than localhost.

## Database migrations

The latest migration adds `channel` to saved conversions. Run:

```bash
cd backend
flask db upgrade
```

before testing the rebuilt Convert and Dashboard pages against an existing database.

## API endpoints used by the rebuilt UI

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `DELETE /api/auth/me`

### Conversions

- `GET /api/conversions`
- `POST /api/conversions`
- `PATCH /api/conversions/<id>`
- `DELETE /api/conversions/<id>`

### Trips

- `GET /api/trips`
- `POST /api/trips`
- `PATCH /api/trips/<id>`
- `DELETE /api/trips/<id>`

### Alerts

- `GET /api/alerts`
- `POST /api/alerts`
- `PATCH /api/alerts/<id>`
- `DELETE /api/alerts/<id>`

## External market data

- ExchangeRate-API free endpoint for live exchange rates.
- Frankfurter for historical charts. Historical coverage is limited to currencies tracked by its ECB data source, so the UI does not fabricate KES historical data.

## Deployment

The frontend remains Vercel-friendly through `vercel.json`. Configure `VITE_API_URL` to point to the deployed Flask API. Configure the Flask backend with `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, and `CORS_ORIGINS`.

# PesaRate

**PesaRate** is a full-stack currency and travel-money workspace built progressively across the Moringa School Software Engineering capstone phases.

The project evolved from a **React-based currency experience in Phase 1**, into a **JWT-authenticated application with a Flask backend in Phase 2**, and finally into a **complete full-stack financial workspace with authentication, PostgreSQL persistence, CRUD functionality, and deployment-ready architecture**.

The progression demonstrates how the application grew from a frontend prototype into a functional full-stack product.

---

## 🚀 Project Progression

### Phase 1 — React Frontend

PesaRate began as a React single-page application focused on creating a polished currency and travel-money experience.

The Phase 1 application established the product concept, user interface, navigation, and core currency functionality.

**Phase 1 highlights:**

* React single-page application
* Responsive dashboard experience
* Currency conversion
* Live exchange-rate data
* Currency and travel-money focused UX
* React state management
* Reusable components
* Client-side routing
* API integration
* Initial PesaRate product identity and interface

The goal of Phase 1 was to establish the **frontend experience and product direction**.

---

### Phase 2 — Flask API + JWT Authentication

Phase 2 transformed PesaRate from a frontend-focused React application into a full-stack application.

A Flask backend was introduced to provide persistent application data, REST API endpoints, and authenticated user interactions.

**Phase 2 highlights:**

* Flask REST API
* JWT-based authentication
* User registration and login
* Protected API routes
* PostgreSQL database architecture
* SQLAlchemy models
* Flask-Migrate / Alembic migrations
* Authenticated CRUD operations
* Saved conversions
* Trips management
* Currency alerts
* Profile management
* React ↔ Flask API integration

This phase established the application's **backend architecture and authenticated data layer**.

---

### Final Phase — Full-Stack PesaRate

The final version brings the frontend and backend together into a complete financial workspace.

PesaRate now combines live market information, authenticated user data, persistent resources, provider-aware conversion estimates, travel planning, alerts, and profile management.

### Current application includes

* **Landing / Authentication** — streamlined login and registration experience.
* **Dashboard** — live exchange rates, recent saved conversions, upcoming trips, and active alerts.
* **Convert** — live conversion, channel/provider selection, estimated fees, saved conversion CRUD, and editing.
* **Trips** — complete CRUD functionality, travel dates, live currency conversion, and travel countdowns.
* **Trends & News** — historical exchange-rate visualization combined with financial context.
* **Alerts** — create, edit, delete, pause, and activate currency alerts.
* **Profile** — profile editing, avatar, account statistics, saved-conversion history, logout, and account deletion.

### Provider-aware conversion

The Convert experience goes beyond simply multiplying an amount by an exchange rate.

Users can select a channel such as:

* Wise
* Remitly
* Bank
* M-Pesa
* Cash pickup

The application uses **demo provider pricing estimates** to simulate fees and show how the selected channel can affect the final amount received.

> **Note:** Provider fees are mock/demo estimates for the capstone application and are not intended to represent live provider pricing.

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│        React / Vite          │
│                              │
│  Dashboard • Convert        │
│  Trips • Alerts • Profile   │
└──────────────┬───────────────┘
               │
               │ REST API
               │ JWT
               ▼
┌──────────────────────────────┐
│          Flask API           │
│                              │
│ Auth • Conversions           │
│ Trips • Alerts • Profile    │
└──────────────┬───────────────┘
               │
               │ SQLAlchemy
               ▼
┌──────────────────────────────┐
│       PostgreSQL / DB        │
│                              │
│ Users • Conversions          │
│ Trips • Alerts               │
└──────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend

* React
* Vite
* JavaScript
* CSS / Tailwind CSS
* React Router
* REST API integration

### Backend

* Python
* Flask
* Flask-JWT-Extended
* Flask-SQLAlchemy
* Flask-Migrate
* Marshmallow

### Database

* PostgreSQL
* SQLAlchemy ORM
* Alembic migrations

### External APIs

* ExchangeRate-API — live exchange rates
* Frankfurter — historical exchange-rate data

### Development & Deployment

* Git
* GitHub
* Vercel — frontend
* Render or similar platform — Flask API
* Supabase/PostgreSQL-compatible database

---

## 🔐 Authentication

PesaRate uses JWT authentication to protect user-specific application data.

Authentication endpoints include:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PATCH  /api/auth/me
DELETE /api/auth/me
```

Authenticated resources are associated with the currently logged-in user, ensuring saved conversions, trips, and alerts remain user-specific.

---

## 📊 API Resources

### Conversions

```text
GET    /api/conversions
POST   /api/conversions
PATCH  /api/conversions/<id>
DELETE /api/conversions/<id>
```

### Trips

```text
GET    /api/trips
POST   /api/trips
PATCH  /api/trips/<id>
DELETE /api/trips/<id>
```

### Alerts

```text
GET    /api/alerts
POST   /api/alerts
PATCH  /api/alerts/<id>
DELETE /api/alerts/<id>
```

---

## 📁 Project Structure

```text
pesarate/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models/
│   │   └── ...
│   ├── migrations/
│   ├── tests/
│   ├── requirements.txt
│   └── run.py
│
├── src/
│   ├── api-client.js
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── utils/
│
├── public/
├── vercel.json
├── package.json
└── README.md
```

---

## 💻 Local Development

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

The Flask API runs at:

```text
http://localhost:5000
```

### Frontend

Open a second terminal:

```bash
npm install
npm run dev
```

The frontend normally runs at:

```text
http://localhost:5173
```

If the Flask API is running on another host, configure:

```text
VITE_API_URL=https://your-backend-url/api
```

---

## 🗄️ Database Migrations

After pulling changes that introduce database updates:

```bash
cd backend
flask db upgrade
```

The migration system keeps the database schema synchronized with the application's SQLAlchemy models.

---

## 🌍 Production Deployment

PesaRate uses a separated frontend/backend architecture.

### Frontend — Vercel

Configure the Vercel environment variable:

```text
VITE_API_URL=https://your-backend-url/api
```

Then redeploy the frontend.

### Backend — Render or similar

Configure:

```text
FLASK_ENV=production
SECRET_KEY=your-production-secret
JWT_SECRET_KEY=your-production-jwt-secret
DATABASE_URL=your-postgresql-connection-string
CORS_ORIGINS=https://pesarate.vercel.app
```

Run database migrations during deployment:

```bash
flask db upgrade
```

The backend must allow the deployed frontend URL through `CORS_ORIGINS`.

---

## 🔎 Troubleshooting

### "Can't reach the PesaRate server"

Check:

1. `VITE_API_URL` is configured in the Vercel project.
2. The backend URL is correct.
3. The Flask API is running.
4. The backend database is connected.
5. `CORS_ORIGINS` includes the deployed frontend URL.
6. The browser Network tab shows requests going to the expected API URL.

For additional deployment information, see `DEPLOYMENT.md`.

---

## 📈 What This Project Demonstrates

PesaRate represents a progression from **frontend development to full-stack engineering**:

```text
Phase 1
React UI
   ↓
API Integration
   ↓
Phase 2
Flask REST API
   ↓
JWT Authentication
   ↓
Database Persistence
   ↓
CRUD Resources
   ↓
Final Phase
Complete Full-Stack Application
   ↓
Deployment-Ready Architecture
```

Rather than rebuilding the application for each phase, PesaRate was progressively extended to demonstrate the development of a real application across multiple stages of the software engineering lifecycle.

---

## 🎓 Capstone Context

PesaRate was developed as a Moringa School Software Engineering capstone project to demonstrate the ability to:

* Design and build a React application
* Consume external APIs
* Build RESTful Flask APIs
* Implement JWT authentication
* Design relational database models
* Implement authenticated CRUD operations
* Integrate frontend and backend systems
* Manage database migrations
* Test backend functionality
* Prepare a full-stack application for deployment

The project ultimately evolved from a **React currency application into a complete authenticated full-stack financial workspace**.

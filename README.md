# AutoCare Pro — Car Repair & Auto Service Website

A full-stack, production-ready car repair and auto service platform. Customers can browse
services, book appointments, manage their vehicles and service history, and leave reviews.
Admins get a full dashboard to manage customers, appointments, services, pricing, reviews and
contact messages.

**Stack:** React (Vite) + Tailwind CSS + Framer Motion on the frontend, Node.js + Express +
MongoDB (Mongoose) on the backend, JWT authentication, and Nodemailer for email notifications.

---

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Local Setup](#local-setup)
5. [Running with Docker](#running-with-docker)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Default Admin Account](#default-admin-account)
9. [Security](#security)

---

## Features

**Customers**
- Browse and search/filter the full service catalog
- Book appointments online with vehicle details, date/time, and notes
- Register, log in, and manage a profile (with password reset via email)
- View and manage appointments (cancel, reschedule), vehicles, and service history
- Leave a rating & review after a completed service
- Contact the workshop / request emergency service

**Admins**
- Dashboard with key stats (customers, appointments, revenue, reviews)
- Manage customers (search, edit, deactivate/delete)
- Manage appointments (search/filter, update status: pending → confirmed → in-progress →
  completed/cancelled)
- Full service CRUD with image upload, pricing and duration management
- Approve/reject and delete reviews
- View and manage contact messages, including emergency requests

**Platform**
- JWT authentication with bcrypt password hashing and role-based authorization
- Rate limiting, Helmet security headers, input validation/sanitization, NoSQL-injection and
  XSS protection
- Responsive, accessible UI with dark/light mode, toast notifications, and animated
  micro-interactions
- SEO: meta tags, Open Graph tags, sitemap.xml, robots.txt
- Email notifications for bookings, status updates, cancellations and password resets
  (gracefully logs to console instead of failing if SMTP isn't configured)

---

## Project Structure

```
car-repair-website/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth, validation, error handling, rate limiting, uploads
│   ├── models/          # Mongoose schemas (User, Vehicle, Service, Appointment, Review, ContactMessage)
│   ├── routes/          # Express routers
│   ├── seed/            # Default services + admin seed script
│   ├── tests/           # Jest + Supertest test suite
│   ├── utils/           # JWT, email sending, email templates
│   └── server.js
│
├── frontend/
│   ├── public/           # robots.txt, sitemap.xml, favicon, OG image
│   └── src/
│       ├── components/   # layout, ui, home, services, booking, reviews, contact, dashboard, admin
│       ├── context/      # Auth & Theme context
│       ├── hooks/        # useAuth, useTheme
│       ├── pages/        # route-level pages (incl. dashboard/ and admin/ subfolders)
│       ├── services/     # axios API layer
│       └── utils/        # constants, validators, icon map
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Prerequisites

- Node.js 20.19+ and npm
- A MongoDB database — either [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended,
  free tier available) or a local MongoDB instance / Docker
- (Optional) An SMTP provider (e.g. Gmail, SendGrid, Mailgun) for real email delivery — without
  one, emails are simply logged to the backend console so the app still works fully in development

---

## Local Setup

### 1. Clone and install dependencies

```bash
git clone <your-repo-url>
cd car-repair-website

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

**Backend** — copy the example file and fill in your values:

```bash
cd backend
cp .env.example .env
```

Key variables:

| Variable | Description |
|---|---|
| `MONGO_URI` | Your MongoDB connection string (Atlas or local) |
| `JWT_SECRET` | A long, random string used to sign auth tokens |
| `CLIENT_URL` | URL of the running frontend (used for CORS and email links) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Credentials for the admin account created by the seed script |
| `SMTP_*` | Optional — leave blank to log emails to the console instead of sending |

**Frontend** — copy the example file:

```bash
cd frontend
cp .env.example .env
```

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` in development |

### 3. Connect MongoDB

- **MongoDB Atlas:** create a free cluster, add a database user, allow your IP (or `0.0.0.0/0`
  for development), and copy the connection string into `MONGO_URI`.
- **Local MongoDB:** install MongoDB Community Server and use
  `MONGO_URI=mongodb://127.0.0.1:27017/car-repair`.
- **Docker:** see [Running with Docker](#running-with-docker) below — MongoDB is provisioned
  automatically.

### 4. Seed default data

Populates the service catalog (15 default services) and creates the admin account defined in
`backend/.env`:

```bash
cd backend
npm run seed
```

### 5. Start the backend

```bash
cd backend
npm run dev      # nodemon, auto-restarts on changes
# or: npm start  # plain node
```

The API runs at `http://localhost:5000` by default (health check at `/api/health`).

### 6. Start the frontend

```bash
cd frontend
npm run dev
```

The app runs at `http://localhost:5173` and talks to the backend via `VITE_API_URL`.

---

## Running with Docker

A `docker-compose.yml` is provided for one-command local development (MongoDB + backend +
frontend, all with hot-reload via mounted volumes):

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- MongoDB: mongodb://localhost:27017

Then seed the database from inside the backend container (or point a local `npm run seed` at
`MONGO_URI=mongodb://localhost:27017/car-repair`).

---

## Testing

The backend includes a Jest + Supertest suite covering authentication, service management,
appointment booking/cancellation/status updates, input validation, and admin authorization. Tests
run against an in-memory MongoDB instance (`mongodb-memory-server`), so no database setup is
required:

```bash
cd backend
npm test
```

---

## Deployment

### Database — MongoDB Atlas

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and note the username/password.
3. Under **Network Access**, allow access from your hosting provider (or `0.0.0.0/0`).
4. Copy the connection string — this is your production `MONGO_URI`.

### Backend — Render or Railway

1. Push this repository to GitHub.
2. Create a new **Web Service** on [Render](https://render.com) (a `backend/render.yaml` blueprint
   is included) or [Railway](https://railway.app), pointing at the `backend/` directory.
3. Build command: `npm install` · Start command: `npm start`.
4. Set environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_*`, `SMTP_*`, etc.)
   in the platform's dashboard — **never** commit real secrets to the repo.
5. Deploy. Once live, note your backend's public URL, e.g. `https://autocarepro-api.onrender.com`.
6. Run the seed script once against production (e.g. via the platform's shell/console):
   `npm run seed`.

### Frontend — Vercel

1. Import the repository into [Vercel](https://vercel.com), setting the project root to
   `frontend/`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add the environment variable `VITE_API_URL` pointing at your deployed backend, e.g.
   `https://autocarepro-api.onrender.com/api`.
4. Deploy. Vercel provides a public HTTPS URL, e.g. `https://autocarepro.vercel.app`.
5. A `frontend/vercel.json` is included with SPA rewrites (so client-side routes like
   `/dashboard` work on refresh) and basic security headers.

### Connect the production API

- Update the backend's `CLIENT_URL` environment variable to your deployed frontend URL (for CORS).
- Update the frontend's `VITE_API_URL` to your deployed backend URL, then redeploy the frontend.
- Confirm everything is wired up by visiting the deployed frontend URL, browsing services, and
  completing a test booking.

Your site is now live at a public URL such as `https://autocarepro.vercel.app` — no `localhost`
references remain in production.

---

## Default Admin Account

Created by `npm run seed` using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` values from `backend/.env`
(defaults to `admin@example.com` / `ChangeMe123!`). **Change these before deploying to
production.**

---

## Security

- Passwords hashed with bcrypt; JWTs signed with a server-side secret
- Role-based route protection (`protect` + `adminOnly` middleware)
- Express-validator input validation on every write endpoint
- `express-mongo-sanitize`, `xss-clean` and `hpp` guard against NoSQL injection, XSS and HTTP
  parameter pollution
- `helmet` sets secure HTTP headers; CORS is restricted to `CLIENT_URL`
- Rate limiting on all API routes (stricter limits on auth endpoints)
- Secrets are read from environment variables only — nothing sensitive is hard-coded or shipped
  to the frontend bundle

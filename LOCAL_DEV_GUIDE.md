# Momentum — Local Development Guide

## Overview

Momentum is now a **local-first monorepo**. Supabase has been removed entirely.
Data is stored in a SQLite database (`backend/data/momentum.db`) on your machine.

```
momentum-react/
├── frontend/          ← Vite + React 19 app
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   │   ├── UserProvider.jsx   ← fetches from local API
│   │   │   └── TourContext.jsx
│   │   ├── hooks/useAuth.js       ← synthetic local session (no login)
│   │   ├── lib/apiClient.js       ← all HTTP calls to the backend
│   │   └── utils/
│   ├── vite.config.js             ← proxies /api → localhost:3001
│   └── package.json
├── backend/           ← Express + Node built-in SQLite (node:sqlite)
│   ├── src/
│   │   ├── server.js              ← entry point, port 3001
│   │   ├── db/
│   │   │   ├── database.js        ← opens momentum.db
│   │   │   └── migrate.js         ← creates tables, seeds default profile
│   │   ├── routes/                ← profile, categories, log, settings
│   │   ├── controllers/           ← business logic per domain
│   │   └── middleware/errorHandler.js
│   ├── data/momentum.db           ← SQLite file (gitignored)
│   └── package.json
├── package.json       ← root — run everything from here
└── LOCAL_DEV_GUIDE.md
```

---

## Prerequisites

| Tool       | Version  | Notes                                            |
|------------|----------|--------------------------------------------------|
| Node.js    | **≥ 22** | `node:sqlite` requires Node 22+; also works on 23 |
| npm        | ≥ 9      | Ships with Node                                  |

Check your version: `node -v`

---

## First-Time Setup

```bash
# 1. Install all dependencies (root + backend + frontend)
npm run install:all

# The root npm install already handles concurrently.
# backend: express, cors
# frontend: react, vite, tailwind, framer-motion, recharts, …
```

---

## Running the App

### Both servers at once (recommended)

```bash
npm run dev
```

This starts:
- **Backend** on `http://localhost:3001` (auto-restarts on file changes via `--watch`)
- **Frontend** on `http://localhost:5173` (Vite HMR)

Open your browser at **http://localhost:5173**.

### Run individually

```bash
# Backend only
npm run dev:backend

# Frontend only
npm run dev:frontend
```

---

## API Reference

All endpoints are prefixed with `/api`. The frontend proxies them via Vite.

| Method | Path                    | Description                           |
|--------|-------------------------|---------------------------------------|
| GET    | /api/health             | Health check                          |
| GET    | /api/profile            | Full profile + userData               |
| PATCH  | /api/profile/onboarding | Mark onboarding complete              |
| GET    | /api/categories         | List all categories                   |
| POST   | /api/categories         | Create a category                     |
| PUT    | /api/categories         | Bulk replace all categories           |
| PUT    | /api/categories/:id     | Update one category                   |
| DELETE | /api/categories/:id     | Delete a category                     |
| GET    | /api/log                | Get full activity log                 |
| PUT    | /api/log                | Replace entire log                    |
| PUT    | /api/log/:date          | Upsert entries for a single date      |
| GET    | /api/settings           | Get all settings                      |
| PATCH  | /api/settings           | Upsert arbitrary settings keys        |

---

## Database

The SQLite database is created automatically at `backend/data/momentum.db` on
first run. It is **gitignored** — you will never accidentally commit your data.

### Schema

```
profiles    — one row per local user (default: id=1, name="Default")
categories  — activity categories with routine + streak info
log_entries — daily activity counts (date × category)
settings    — key-value store (focusDuration, focusSession, …)
```

### Inspect the database

```bash
# Using sqlite3 CLI (if installed)
sqlite3 backend/data/momentum.db

sqlite> .tables
sqlite> SELECT * FROM profiles;
sqlite> SELECT * FROM categories;
sqlite> SELECT date, category_id, count FROM log_entries ORDER BY date DESC LIMIT 20;
```

### Reset the database

```bash
rm backend/data/momentum.db
# Restart the backend — it will re-create and seed a fresh database
```

---

## Architecture Notes

### No Login Required

This is a single-user local app. The `useAuth` hook returns a synthetic session
so the rest of the app's routing logic is unchanged. There is no login screen.

### The `saveData` Flow

`UserProvider.saveData(newUserData)` sends **three parallel requests**:
1. `PUT /api/categories` — bulk-replaces all categories (with streak data)
2. `PUT /api/log` — replaces the entire activity log
3. `PATCH /api/settings` — upserts `focusDuration` and `focusSession`

This mirrors exactly the behaviour of the old `supabase.from('profiles').update()`
single-table save — just split across normalized tables.

### Adding Multi-User Support

The backend is multi-user ready. Every table has a `profile_id` column. To add
proper user switching:
1. Add a `GET /api/profiles` endpoint
2. Pass `profileId` as a query param or request header
3. Replace the `const PID = 1` constant in each controller with `req.params.profileId`

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `ExperimentalWarning: SQLite is an experimental feature` | Expected on Node 22/23. Safe to ignore. |
| Backend won't start — port 3001 busy | `lsof -i :3001` then kill the process |
| Frontend shows blank screen / network error | Make sure the backend is running first |
| `node:sqlite` not found | Upgrade to Node ≥ 22 |
| Categories/log not saving | Open DevTools → Network tab, inspect failing `/api/*` calls |

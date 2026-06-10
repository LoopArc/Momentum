Migration Complete
What was built
Monorepo structure:


momentum-react/
├── frontend/          ← React app (moved from root, Supabase removed)
├── backend/           ← New Express + SQLite backend
├── package.json       ← Root: `npm run dev` starts both concurrently
└── LOCAL_DEV_GUIDE.md
Backend (backend/src/):

node:sqlite (Node 23 built-in) — zero native compilation, works on your machine
4 domain controllers: profileController, categoryController, logController, settingsController
14 REST endpoints covering the full CRUD surface the frontend needs
Auto-migration on startup, seeds a default profile on first run
Every file is under 120 lines — strict SRP maintained
Frontend changes:

src/lib/supabaseClient.js — deleted
src/components/LoginScreen.jsx — deleted (no auth needed locally)
src/hooks/useAuth.js — replaced with synthetic local session (1 line)
src/context/UserProvider.jsx — rewritten to call apiClient.js
src/lib/apiClient.js — new: thin fetch wrapper for all backend calls
src/App.jsx — simplified (no login routing)
src/components/features/Header.jsx — Supabase sign-out removed
Stale AppContext*.jsx copies deleted
Confirmed working:

vite build — zero errors, 2708 modules transformed
All 7 API endpoints tested end-to-end via curl, all return correct data
To run

npm run dev          # starts backend on :3001 + frontend on :5173
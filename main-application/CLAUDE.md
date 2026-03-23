# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Urbantrends Community — a full-stack community platform with AI-powered architect assistant, group management with invite codes, and role-based access control (MEMBER, MODERATOR, ADMIN, ARCHITECT).

## Repository Layout

```
main-application/
├── back-end/community-backend-app/    # Django 6.0.3 + DRF + PostgreSQL 16
├── front-end/community-application/   # React 19 + TypeScript + Vite 7 + Tailwind 4
└── scripts/docker-compose.yml         # Docker Compose orchestration
```

## Development Commands

### Back-end (Django)

```bash
cd back-end/community-backend-app

# Run dev server
python manage.py runserver

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start with Docker Compose (from scripts/)
docker compose -f scripts/docker-compose.yml up --build
```

Production runs via Gunicorn (3 workers, 3 threads) on port 8000 inside the container, mapped to `127.0.0.1:8003`.

### Front-end (React)

```bash
cd front-end/community-application

npm run dev       # Vite dev server on port 5173
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # Preview production build
```

### Docker Compose

```bash
cd scripts
docker compose up --build    # Starts PostgreSQL (port 5435) + Django app (port 8003)
```

## Architecture

### Back-end Django Apps

- **`community_appliccation/`** — Django settings and root URL config (note: the typo "appliccation" is intentional/existing in the codebase)
- **`community_accounts/`** — User registration, JWT auth (SimpleJWT), CommunityProfile model with roles
- **`community_groups/`** — Group CRUD, membership management, invite link system with expiry/usage limits
- **`community_ai/`** — Google Gemini AI integration (gemini-2.0-flash with fallback chain), stores queries per user
- **`community_announcements/`** — Announcements with categories (SYSTEM/EVENT/UPDATE/ALERT), priorities, pinning. Admin/moderator write access
- **`community_discussions/`** — Discussion threads with categories (GENERAL/DEV_TALK/PROPOSAL/CODE_REVIEW), threaded comments, resolve/pin actions. Includes trending endpoint

Root URL routing: `accounts/` → accounts app, `api/groups/` → groups app, `api/ai/` → AI app, `api/announcements/` → announcements app, `api/discussions/` → discussions app, `api/trending/` → trending view.

### Front-end Architecture

- **Entry:** `src/main.tsx` wraps app with StrictMode → TooltipProvider → ThemeProvider → BrowserRouter → AuthProvider
- **Auth:** Context-based (`auth-context.tsx`) using JWT stored in localStorage; `ProtectedRoute.tsx` guards authenticated pages
- **API client:** `lib/api.ts` — Axios instance pointing to `https://unity.urbantrends.dev/` with automatic token refresh on 401
- **UI:** shadcn/ui components (`components/ui/`), Phosphor Icons, monospace/cyberpunk aesthetic
- **Path alias:** `@` maps to `./src` (configured in vite.config.ts and tsconfig.json)

### Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/accounts/auth/register/` | User registration |
| POST | `/accounts/auth/login/` | Login (returns JWT pair) |
| POST | `/accounts/auth/refresh/` | Refresh access token |
| GET/PATCH | `/accounts/accounts/me/` | Current user profile |
| GET | `/accounts/accounts/<slug>/` | Public profile |
| GET/POST | `/api/groups/` | List/create groups |
| POST | `/api/groups/{id}/join/` | Join group with invite code |
| POST | `/api/groups/{id}/leave/` | Leave group |
| POST | `/api/members/{id}/promote/` | Promote to moderator |
| POST | `/api/members/{id}/demote/` | Demote from moderator |
| GET/POST | `/api/invites/` | List/create invite links |
| GET/POST | `/api/ai/queries/` | List/submit AI queries |
| GET | `/accounts/accounts/` | Member directory (search, filter, paginated) |
| GET/POST | `/api/announcements/` | List/create announcements |
| GET/POST | `/api/discussions/` | List/create discussions (?category= filter) |
| GET/POST | `/api/discussions/{id}/comments/` | List/create comments on discussion |
| POST | `/api/discussions/{id}/resolve/` | Toggle resolved status |
| POST | `/api/discussions/{id}/pin/` | Toggle pinned status |
| GET | `/api/trending/` | Trending discussions, active members, recent announcements |

## Environment & Config

- **Back-end env file:** `back-end/community-backend-app/community.env` (loaded by Docker Compose)
- **Required env vars:** `DATABASE_URL`, `GOOGLE_API_KEY`
- **Database:** PostgreSQL 16 on port 5435 (host) → 5432 (container)
- **JWT:** Access token lifetime 1 hour, refresh token 7 days, rotation enabled
- **CORS:** Allows `localhost:5173` and `community.urbantrends.dev`
- **Django timezone:** Africa/Nairobi

## Conventions

- Django ViewSets with custom actions (e.g., `@action` for join/leave/promote/demote)
- Custom DRF permission classes: `IsGroupMember`, `IsGroupModerator`
- Nested serializers for read vs write operations (e.g., `CommunityProfileSerializer` vs `CommunityProfileUpdateSerializer`)
- Front-end uses React Router v7 with layout routes wrapping protected content
- Tailwind CSS with shadcn/ui component library — do not manually write CSS; use utility classes and shadcn components

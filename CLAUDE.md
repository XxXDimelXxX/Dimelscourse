# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dimel's School — an educational platform MVP. Monorepo with npm workspaces containing a NestJS API backend and React frontend.

## Commands

```bash
# Development
npm run dev:api         # Start API with ts-node-dev (hot reload)
npm run dev             # Start frontend Vite dev server (port 5173)

# Building
npm run build           # Build both web and API
npm run build:web       # Build frontend only
npm run build:api       # Build API only

# Database
npm run seed:api        # Seed database with test data
```

No test runner is configured yet. No linter/formatter config exists at the project level.

## Architecture

**Monorepo layout:** `apps/api` (NestJS + TypeORM + PostgreSQL) and `apps/web` (React + Vite + Tailwind CSS).

### Backend (`apps/api`)

NestJS 11 with TypeORM 0.3, PostgreSQL (default port 5436), and Zod for validation.

**Module structure** (`apps/api/src/modules/`):
- **identity-access** — Auth (local JWT + refresh tokens). Guards: `AccessTokenGuard`, `RolesGuard`. Entities: `User`, `AuthIdentity`, `RefreshSession`. Roles: `student`, `admin`, `instructor`.
- **catalog** — Course browsing. Entities: `Course` (keyed by slug), `CourseModule`, `Lesson`, `CourseResource`, `Instructor`.
- **learning** — Enrollment, lesson progress tracking, achievements, activity logs, study plans. Services: `LearningService` (course workspace), `DashboardService` (student stats), `EnrollmentService` (shared grant/revoke logic).
- **payments** — Checkout and webhook flow. Mock payment gateway. Entity: `Payment` (one-time | subscription). Uses `EnrollmentService` for access grants.
- **community** — Course comments/discussions.
- **admin** — Admin panel endpoints (user management, course editing, payment history, overview stats, video upload). Uses `EnrollmentService` for access management. `VideoUploadController` handles presigned URL flow for S3.

**Core utilities** (`apps/api/src/core/`):
- `config/` — Custom `.env` loader, separate config files for app, database, auth, s3, TypeORM. Auth and S3 configs validate secrets in production.
- `services/s3.service.ts` — VK Cloud S3 integration: presigned upload/download URLs, delete, metadata. Used for lesson video storage.
- `pipes/zod-validation.pipe.ts` — Shared Zod validation pipe used across all modules. Returns field-level error details.
- `utils/course.utils.ts` — Shared course module/lesson sorting logic (`getSortedLessons`, `getSortedModules`).
- `database/typeorm-entities.ts` — All TypeORM entity registrations.

### Video Storage (VK Cloud S3)

Videos stored in VK Cloud Object Storage (S3-compatible). Flow:
1. Admin selects file → frontend requests presigned PUT URL from backend
2. Frontend uploads directly to S3 via presigned URL (no proxy through backend)
3. Frontend confirms upload → backend saves S3 key in `LessonEntity.videoS3Key`
4. Student requests course → backend generates presigned GET URL (1-hour TTL) for each unlocked lesson
5. Frontend plays video via `<video src={presignedUrl}>` with `controlsList="nodownload"`

S3 keys format: `videos/{courseSlug}/{lessonId}.{ext}`. Bucket: private (presigned URLs only).

**API base URL**: `http://127.0.0.1:3000`. CORS origin defaults to `http://localhost:5173`.

### Frontend (`apps/web`)

React 18 + React Router 7 + Vite. UI built with Radix UI/shadcn components, MUI, and Tailwind CSS 4.

**Key files:**
- `src/app/routes.tsx` — All route definitions (public, protected, admin).
- `src/app/context/AuthContext.tsx` — Auth state, token storage (`localStorage` key: `dimelscourse.auth-session`), auto-refresh on 401.
- `src/app/lib/api-client.ts` — Shared HTTP client (`requestJson`, `extractErrorMessage`, `API_URL`). Single source of truth for API communication.
- `src/app/lib/auth.ts` — Auth API calls, `authorizedRequest()` wrapper with automatic token injection and refresh. Uses `api-client.ts`.
- `src/app/lib/lms-api.ts` — All API types and fetch functions. Uses `api-client.ts` for public requests, `auth.ts` for authorized requests.
- `src/app/lib/formatters.ts` — Shared formatting utilities (`formatDateLabel`, `formatDurationMinutes`, `levelLabel`, `getErrorMessage`).
- `src/app/hooks/useAsyncData.ts` — Generic hook for async data fetching with loading/error states.
- `src/app/pages/` — Page components (Home, Dashboard, CourseView, Purchase, admin pages).
- `src/app/components/ui/` — Reusable UI components (shadcn/Radix wrappers).

**Path alias**: `@` maps to `src/` in Vite config.

### Auth Flow

Register/login → receive `accessToken` + `refreshToken` → access token in Authorization header → auto-refresh on 401 → refresh token invalidated on logout. Access token TTL: 15 min, refresh: 30 days.

## Environment

API env vars are in `apps/api/.env` (loaded by custom `env.loader.ts`, not dotenv). Key variables: `DB_HOST`, `DB_PORT` (default 5436), `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `AUTH_ACCESS_TOKEN_SECRET`, `AUTH_REFRESH_TOKEN_SECRET`, `DB_SYNCHRONIZE=true` (auto-syncs schema in dev).

Frontend uses `VITE_API_URL` (defaults to `http://127.0.0.1:3000`).

## Conventions

- Backend uses NestJS decorators, CommonJS modules, TypeORM entities with UUID primary keys.
- Frontend uses ESNext modules, React functional components, TypeScript.
- Course URLs use slugs, not IDs.
- Validation uses Zod schemas with `ZodValidationPipe` (all backend DTOs), react-hook-form (frontend forms).
- All DTOs are Zod-inferred types (`z.infer<typeof schema>`), not class-based.
- Enrollment management (grant/revoke access) is centralized in `EnrollmentService` — do not duplicate in other services.
- Course module/lesson sorting uses shared `getSortedLessons`/`getSortedModules` from `core/utils/course.utils.ts`.
- Frontend error handling uses `getErrorMessage()` from `lib/formatters.ts` — do not use inline `error instanceof Error` patterns.
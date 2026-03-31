# Frontend App

React 18 + React Router 7 + Vite. UI: Radix/shadcn components + Tailwind CSS 4.

## Key Architecture

- **API client** (`lib/api-client.ts`) — `requestJson()` for public endpoints, `API_URL` base.
- **Auth** (`lib/auth.ts`) — `authorizedRequest()` with auto-refresh on 401. Session in localStorage key `dimelscourse.auth-session`.
- **API functions** (`lib/lms-api.ts`) — All typed API calls. Admin functions use `authorizedRequest`.
- **Data fetching** (`hooks/useAsyncData.ts`) — Generic hook with loading/error/reload.
- **Error handling** (`lib/formatters.ts`) — `getErrorMessage()` for consistent error display.

## Admin Pages

- `/admin/courses` — Course list + create modal
- `/admin/courses/:slug` — Course metadata editing (CourseSubNav for tab navigation)
- `/admin/courses/:slug/structure` — Modules & lessons CRUD with modals, reorder arrows, video upload
- `/admin/courses/:slug/resources` — Lesson resource management with file upload

## Admin Components (`components/admin/`)

- **CourseSubNav** — Tab navigation between meta/structure/resources
- **CreateCourseModal**, **CreateModuleModal**, **EditModuleModal** — CRUD modals
- **CreateLessonModal**, **EditLessonModal** — Lesson forms with TipTap editor tab
- **LessonContentEditor** — TipTap rich-text editor with image upload to S3
- **VideoUploadButton** — 3-step presigned S3 upload with progress
- **ResourceUploadButton** — File upload for lesson resources
- **DeleteConfirmDialog** — Shared AlertDialog for destructive confirmations

## Patterns

- All admin pages use `useAsyncData` + `reload()` after mutations (no optimistic updates)
- Modals use local state (`useState`) for open/close
- shadcn components preferred over raw HTML in admin pages
- Role check in `AdminLayout`: allows both `admin` and `superadmin`

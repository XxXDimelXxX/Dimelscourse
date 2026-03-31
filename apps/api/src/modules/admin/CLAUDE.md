# Admin Module

Admin panel endpoints for course management, user management, payments, and video/file uploads.

## Controllers

- **AdminController** (`/admin`) — Overview stats, user listing, access toggle, payments listing. Legacy course endpoints (`/admin/course/:slug`) kept for backward compat.
- **AdminCoursesController** (`/admin/courses`) — Full CRUD for courses, modules, and lessons. Ownership-filtered: regular admins see only their courses, superadmins see all.
- **AdminResourcesController** (`/admin`) — CRUD for lesson resources with S3 file upload flow.
- **VideoUploadController** (`/admin/lessons`) — Presigned S3 upload for lesson videos and TipTap content images.

## Services

- **AdminService** — Overview, users, payments, legacy course methods.
- **AdminCoursesService** — Course/module/lesson CRUD with ownership checks. Key helpers: `assertOwnership()`, `buildOwnershipWhere()`, `normalizePositions()`, `updateCourseLessonCount()`.
- **AdminResourcesService** — Resource CRUD with S3 file management.

## Auth

All controllers require `AccessTokenGuard` + `RolesGuard` with `@Roles(UserRole.ADMIN, UserRole.SUPERADMIN)`. Ownership is enforced in service layer via `course.createdById`.

## S3 Key Patterns

- Videos: `videos/{courseSlug}/{lessonId}.{ext}`
- Content images: `content/{courseSlug}/{lessonId}/{uniqueId}.{ext}`
- Resource files: `resources/{courseSlug}/{lessonId}/{uniqueId}.{ext}`

## DTOs

All DTOs use Zod schemas (`z.object()`) with `ZodValidationPipe`. Types are inferred via `z.infer<typeof schema>`.

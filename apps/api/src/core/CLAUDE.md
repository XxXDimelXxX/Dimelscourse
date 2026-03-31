# Core Utilities

Shared infrastructure used across all modules.

## Config (`config/`)

- Custom `.env` loader (`env.loader.ts`) — not dotenv
- Separate config files: app, database, auth (JWT secrets), s3 (VK Cloud)
- Auth and S3 configs validate secrets in production mode

## Services

- **S3Service** — VK Cloud S3 (compatible with AWS SDK). Methods: `getPresignedUploadUrl`, `getPresignedDownloadUrl`, `deleteObject`, `getObjectMetadata`, `buildVideoKey`. Uses `forcePathStyle: true`.

## Pipes

- **ZodValidationPipe** — Shared Zod validation. Returns field-level error details as `["field.path: message", ...]`.

## Utils

- **course.utils.ts** — `getSortedLessons()` (flat sorted array), `getSortedModules()` (nested sorted structure). Used by learning, payments, and admin modules.

## Database

- **typeorm-entities.ts** — All 15 entity registrations. Must be updated when adding new entities.
- `DB_SYNCHRONIZE=true` in dev — auto-syncs schema. No migrations yet.
- PostgreSQL enum changes (adding values) require manual `ALTER TYPE ... ADD VALUE` before restart.

# Catalog Module

Public-facing course browsing. Entities define the course content structure.

## Entities

- **CourseEntity** — Main course record. Key fields: `slug` (unique URL), `isPublished`, `createdById` (FK to User for ownership), `level`, `priceUsd`. Denormalized counters: `lessonCount`, `studentsCount`, `rating`.
- **CourseModuleEntity** — Section/chapter within a course. Sorted by `position`. Cascade deletes lessons.
- **LessonEntity** — Individual lesson. Fields: `content` (TipTap JSON string), `isDraft` (hidden from students), `videoS3Key`, `isPreview`, `isLockedByDefault`, `position`.
- **CourseResourceEntity** — File/link attached to a lesson. Has both `lessonId` and `courseId` (nullable, courseId for legacy data). S3 fields: `fileS3Key`, `fileOriginalName`, `fileSizeBytes`.
- **InstructorEntity** — Standalone profile, not linked to UserEntity.

## Service

- **CoursesService** — `findAllPublished()`, `findBySlug()`. Filters out `isDraft` lessons from public responses.

## Important Notes

- Draft lessons (`isDraft = true`) must be excluded from all student-facing queries.
- Course module/lesson sorting uses shared utils from `core/utils/course.utils.ts`.
- `ResourceType` enum includes: pdf, zip, link, video, image.

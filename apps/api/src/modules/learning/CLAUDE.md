# Learning Module

Enrollment, progress tracking, and student dashboard.

## Services

- **LearningService** — `getCourseWorkspace()` (full course view for enrolled student with lock/unlock logic and presigned video URLs), `completeLesson()` (marks lesson done, recalculates enrollment progress).
- **DashboardService** — Student stats, course list, achievements, activity, study plan.
- **EnrollmentService** — `grantAccess()` / `revokeAccess()`. Shared by payments and admin modules. Revoke sets status to PAUSED (preserves progress).

## Entities

- **EnrollmentEntity** — Links user to course. Status: active/completed/paused. Denormalized progress fields updated on each `completeLesson`.
- **LessonProgressEntity** — Per-lesson completion tracking. `watchSeconds` exists but is not populated.
- **AchievementEntity**, **ActivityLogEntity**, **StudyPlanItemEntity** — Schema exists but write logic not implemented yet.

## Important Notes

- Draft lessons (`isDraft = true`) are filtered out from workspace and progress calculations.
- Enrollment uses upsert pattern — reactivates paused enrollments rather than creating duplicates.
- `EnrollmentService` is the single source of truth for access management — do not duplicate in other modules.

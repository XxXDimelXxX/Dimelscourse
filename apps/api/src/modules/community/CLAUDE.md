# Community Module

Course comments/discussions.

## Endpoints

- `GET /courses/:slug/comments` — Public comment listing (no auth required)
- `POST /courses/:slug/comments` — Authenticated comment creation

## Entity

**CourseCommentEntity** — body (text), linked to course and author (user).

## Limitations

- No edit/delete endpoints
- No pagination (all comments fetched at once)
- No enrollment check — any authenticated user can comment

# Identity & Access Module

Authentication and authorization. JWT-based local auth with refresh tokens.

## Entities

- **UserEntity** — Roles: `student`, `admin`, `superadmin`, `instructor`. `superadmin` sees all courses/users in admin panel. `isActive` is the soft-ban flag.
- **AuthIdentityEntity** — Multi-provider identity (local, google enum values). Password hash stored here with `select: false`.
- **RefreshSessionEntity** — Persisted JWT sessions with token hash, expiry, revocation.

## Guards & Decorators

- **AccessTokenGuard** — Validates JWT access token from Authorization header.
- **RolesGuard** — Checks `@Roles()` decorator against `request.user.role`. Uses `requiredRoles.includes(user.role)`.
- **@Roles(...)** — Decorator setting required roles on controller/handler.
- **@CurrentUser()** — Param decorator extracting `AuthenticatedUser` from request.

## Services

- **AuthService** — Login, register, get current user.
- **AuthTokensService** — JWT sign/verify, refresh token rotation.
- **PasswordService** — bcrypt hash/compare.

## Auth Flow

Register/login → accessToken (15min) + refreshToken (30d) → auto-refresh on 401 → refresh invalidated on logout.

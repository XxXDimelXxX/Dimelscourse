import { AuthProvider } from "../entities/auth-identity.entity";
import { UserRole } from "../entities/user.entity";

export interface AccessTokenPayload {
  sub: string;
  role: UserRole;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  authProviders: AuthProvider[];
  type: "access";
}

export interface RefreshTokenPayload {
  sub: string;
  sessionId: string;
  authIdentityId: string;
  type: "refresh";
}

import { AuthProvider } from "../entities/auth-identity.entity";
import { UserRole } from "../entities/user.entity";

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl: string | null;
  authProviders: AuthProvider[];
}

import { AuthProvider } from "../entities/auth-identity.entity";
import { UserRole } from "../entities/user.entity";

export interface AuthUserDto {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  avatarUrl: string | null;
  authProviders: AuthProvider[];
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  user: AuthUserDto;
}

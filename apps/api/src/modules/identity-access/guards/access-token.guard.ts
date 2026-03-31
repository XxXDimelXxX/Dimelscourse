import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthTokensService } from "../services/auth-tokens.service";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly authTokensService: AuthTokensService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      user?: AuthenticatedUser;
    }>();
    const authorization = request.headers.authorization;

    if (!authorization || Array.isArray(authorization)) {
      throw new UnauthorizedException("Authentication required");
    }

    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new UnauthorizedException("Authentication required");
    }

    request.user = this.authTokensService.verifyAccessToken(token);
    return true;
  }
}

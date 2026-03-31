import { Injectable, UnauthorizedException } from "@nestjs/common";
import { createHash } from "node:crypto";
import * as jwt from "jsonwebtoken";
import { getAuthConfig } from "../../../core/config";
import { AuthProvider } from "../entities/auth-identity.entity";
import { UserEntity } from "../entities/user.entity";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../interfaces/auth-token-payload.interface";

@Injectable()
export class AuthTokensService {
  signAccessToken(user: UserEntity, authProviders: AuthProvider[]): string {
    const config = getAuthConfig();

    return jwt.sign(
      {
        sub: user.id,
        role: user.role,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        authProviders,
        type: "access",
      } satisfies AccessTokenPayload,
      config.accessTokenSecret,
      {
        algorithm: "HS256",
        expiresIn: `${config.accessTokenTtlMinutes}m`,
      },
    );
  }

  signRefreshToken(payload: {
    userId: string;
    sessionId: string;
    authIdentityId: string;
  }): string {
    const config = getAuthConfig();

    return jwt.sign(
      {
        sub: payload.userId,
        sessionId: payload.sessionId,
        authIdentityId: payload.authIdentityId,
        type: "refresh",
      } satisfies RefreshTokenPayload,
      config.refreshTokenSecret,
      {
        algorithm: "HS256",
        expiresIn: `${config.refreshTokenTtlDays}d`,
      },
    );
  }

  verifyAccessToken(token: string): AuthenticatedUser {
    const config = getAuthConfig();

    try {
      const payload = jwt.verify(token, config.accessTokenSecret) as AccessTokenPayload;

      if (payload.type !== "access") {
        throw new UnauthorizedException("Authentication required");
      }

      return {
        id: payload.sub,
        email: payload.email,
        displayName: payload.displayName,
        role: payload.role,
        avatarUrl: payload.avatarUrl,
        authProviders: payload.authProviders,
      };
    } catch {
      throw new UnauthorizedException("Authentication required");
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload {
    const config = getAuthConfig();

    try {
      const payload = jwt.verify(token, config.refreshTokenSecret) as RefreshTokenPayload;

      if (payload.type !== "refresh") {
        throw new UnauthorizedException("Authentication required");
      }

      return payload;
    } catch {
      throw new UnauthorizedException("Authentication required");
    }
  }

  hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  getRefreshTokenExpiresAt(): Date {
    const config = getAuthConfig();
    return new Date(Date.now() + config.refreshTokenTtlDays * 24 * 60 * 60 * 1000);
  }
}

import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthResponseDto, AuthUserDto } from "../dto/local-auth-response.dto";
import { LoginLocalDto } from "../dto/login-local.dto";
import { RefreshTokenDto } from "../dto/refresh-token.dto";
import { RegisterLocalDto } from "../dto/register-local.dto";
import { AuthIdentityEntity, AuthProvider } from "../entities/auth-identity.entity";
import { RefreshSessionEntity } from "../entities/refresh-session.entity";
import { UserEntity, UserRole } from "../entities/user.entity";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { AuthTokensService } from "./auth-tokens.service";
import { PasswordService } from "./password.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(AuthIdentityEntity)
    private readonly authIdentitiesRepository: Repository<AuthIdentityEntity>,
    @InjectRepository(RefreshSessionEntity)
    private readonly refreshSessionsRepository: Repository<RefreshSessionEntity>,
    private readonly passwordService: PasswordService,
    private readonly authTokensService: AuthTokensService,
  ) {}

  async registerLocal(
    dto: RegisterLocalDto,
    context: { userAgent?: string; ipAddress?: string },
  ): Promise<AuthResponseDto> {
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email },
    });
    const existingIdentity = await this.authIdentitiesRepository.findOne({
      where: {
        provider: AuthProvider.LOCAL,
        providerUserId: dto.email,
      },
    });

    if (existingUser || existingIdentity) {
      throw new ConflictException("Account already exists");
    }

    const user = await this.usersRepository.save(
      this.usersRepository.create({
        email: dto.email,
        displayName: dto.displayName,
        role: UserRole.STUDENT,
        isActive: true,
        avatarUrl: null,
      }),
    );

    const passwordHash = await this.passwordService.hash(dto.password);
    const identity = await this.authIdentitiesRepository.save(
      this.authIdentitiesRepository.create({
        userId: user.id,
        provider: AuthProvider.LOCAL,
        providerUserId: dto.email,
        email: dto.email,
        passwordHash,
        lastLoginAt: new Date(),
      }),
    );

    return this.issueAuthResponse(user, identity, context);
  }

  async loginLocal(
    dto: LoginLocalDto,
    context: { userAgent?: string; ipAddress?: string },
  ): Promise<AuthResponseDto> {
    const identity = await this.authIdentitiesRepository
      .createQueryBuilder("identity")
      .addSelect("identity.passwordHash")
      .leftJoinAndSelect("identity.user", "user")
      .where("identity.provider = :provider", {
        provider: AuthProvider.LOCAL,
      })
      .andWhere("identity.providerUserId = :providerUserId", {
        providerUserId: dto.email,
      })
      .getOne();

    if (!identity?.passwordHash || !identity.user?.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordValid = await this.passwordService.compare(
      dto.password,
      identity.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    identity.lastLoginAt = new Date();
    await this.authIdentitiesRepository.save(identity);

    return this.issueAuthResponse(identity.user, identity, context);
  }

  async refresh(
    dto: RefreshTokenDto,
    context: { userAgent?: string; ipAddress?: string },
  ): Promise<AuthResponseDto> {
    const payload = this.authTokensService.verifyRefreshToken(dto.refreshToken);
    const session = await this.refreshSessionsRepository.findOne({
      where: { id: payload.sessionId, userId: payload.sub },
      relations: {
        user: {
          authIdentities: true,
        },
        authIdentity: true,
      },
    });

    if (
      !session ||
      session.revokedAt ||
      session.authIdentityId !== payload.authIdentityId ||
      session.expiresAt.getTime() <= Date.now() ||
      session.tokenHash !== this.authTokensService.hashRefreshToken(dto.refreshToken) ||
      !session.user?.isActive
    ) {
      if (session && !session.revokedAt) {
        session.revokedAt = new Date();
        await this.refreshSessionsRepository.save(session);
      }

      throw new UnauthorizedException("Authentication required");
    }

    session.lastUsedAt = new Date();
    session.userAgent = context.userAgent ?? session.userAgent;
    session.ipAddress = context.ipAddress ?? session.ipAddress;

    return this.issueAuthResponse(session.user, session.authIdentity, context, session);
  }

  async logout(dto: RefreshTokenDto): Promise<{ success: true }> {
    try {
      const payload = this.authTokensService.verifyRefreshToken(dto.refreshToken);
      const session = await this.refreshSessionsRepository.findOne({
        where: { id: payload.sessionId, userId: payload.sub },
      });

      if (session && !session.revokedAt) {
        session.revokedAt = new Date();
        await this.refreshSessionsRepository.save(session);
      }
    } catch {
      return { success: true };
    }

    return { success: true };
  }

  getCurrentUser(user: AuthenticatedUser): AuthUserDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      authProviders: user.authProviders,
    };
  }

  private async issueAuthResponse(
    user: UserEntity,
    authIdentity: AuthIdentityEntity,
    context: { userAgent?: string; ipAddress?: string },
    existingSession?: RefreshSessionEntity,
  ): Promise<AuthResponseDto> {
    const authProviders = await this.getUserAuthProviders(user.id);
    const accessToken = this.authTokensService.signAccessToken(user, authProviders);
    let session = existingSession;

    if (!session) {
      session = await this.refreshSessionsRepository.save(
        this.refreshSessionsRepository.create({
          userId: user.id,
          authIdentityId: authIdentity.id,
          expiresAt: this.authTokensService.getRefreshTokenExpiresAt(),
          revokedAt: null,
          lastUsedAt: new Date(),
          userAgent: context.userAgent ?? null,
          ipAddress: context.ipAddress ?? null,
          tokenHash: "",
        }),
      );
    } else {
      session.expiresAt = this.authTokensService.getRefreshTokenExpiresAt();
      session.revokedAt = null;
      session.lastUsedAt = new Date();
      session.userAgent = context.userAgent ?? session.userAgent;
      session.ipAddress = context.ipAddress ?? session.ipAddress;
    }

    const refreshToken = this.authTokensService.signRefreshToken({
      userId: user.id,
      sessionId: session.id,
      authIdentityId: authIdentity.id,
    });

    session.tokenHash = this.authTokensService.hashRefreshToken(refreshToken);
    await this.refreshSessionsRepository.save(session);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        avatarUrl: user.avatarUrl,
        authProviders,
      },
    };
  }

  private async getUserAuthProviders(userId: string): Promise<AuthProvider[]> {
    const identities = await this.authIdentitiesRepository.find({
      where: { userId },
    });

    return [...new Set(identities.map((identity) => identity.provider))];
  }
}

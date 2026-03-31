import { Module } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthController } from "./controllers/auth.controller";
import { AuthIdentityEntity } from "./entities/auth-identity.entity";
import { RefreshSessionEntity } from "./entities/refresh-session.entity";
import { UserEntity } from "./entities/user.entity";
import { AccessTokenGuard } from "./guards/access-token.guard";
import { RolesGuard } from "./guards/roles.guard";
import { AuthTokensService } from "./services/auth-tokens.service";
import { AuthService } from "./services/auth.service";
import { PasswordService } from "./services/password.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      AuthIdentityEntity,
      RefreshSessionEntity,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordService,
    AuthTokensService,
    AccessTokenGuard,
    RolesGuard,
    Reflector,
  ],
  exports: [
    TypeOrmModule,
    AuthService,
    AuthTokensService,
    AccessTokenGuard,
    RolesGuard,
  ],
})
export class IdentityAccessModule {}

import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Post,
  UseGuards,
} from "@nestjs/common";
import { CurrentUser } from "../decorators/current-user.decorator";
import { LoginLocalDto, loginLocalSchema } from "../dto/login-local.dto";
import { RefreshTokenDto, refreshTokenSchema } from "../dto/refresh-token.dto";
import {
  RegisterLocalDto,
  registerLocalSchema,
} from "../dto/register-local.dto";
import { AccessTokenGuard } from "../guards/access-token.guard";
import { AuthenticatedUser } from "../interfaces/authenticated-user.interface";
import { ZodValidationPipe } from "../pipes/zod-validation.pipe";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(
    @Body(new ZodValidationPipe(registerLocalSchema)) dto: RegisterLocalDto,
    @Headers("user-agent") userAgent?: string,
    @Ip() ipAddress?: string,
  ) {
    return this.authService.registerLocal(dto, {
      userAgent,
      ipAddress,
    });
  }

  @Post("login/local")
  loginLocal(
    @Body(new ZodValidationPipe(loginLocalSchema)) dto: LoginLocalDto,
    @Headers("user-agent") userAgent?: string,
    @Ip() ipAddress?: string,
  ) {
    return this.authService.loginLocal(dto, {
      userAgent,
      ipAddress,
    });
  }

  @Post("refresh")
  refresh(
    @Body(new ZodValidationPipe(refreshTokenSchema)) dto: RefreshTokenDto,
    @Headers("user-agent") userAgent?: string,
    @Ip() ipAddress?: string,
  ) {
    return this.authService.refresh(dto, {
      userAgent,
      ipAddress,
    });
  }

  @Post("logout")
  logout(@Body(new ZodValidationPipe(refreshTokenSchema)) dto: RefreshTokenDto) {
    return this.authService.logout(dto);
  }

  @UseGuards(AccessTokenGuard)
  @Get("me")
  me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getCurrentUser(user);
  }
}

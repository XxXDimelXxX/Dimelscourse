import { Body, Controller, Post } from "@nestjs/common";
import { LoginUserUseCase } from "../application/login-user.use-case";
import { RegisterUserUseCase } from "../application/register-user.use-case";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post("register")
  register(
    @Body() body: { email: string; displayName: string; password: string },
  ) {
    return this.registerUserUseCase.execute(body);
  }

  @Post("login")
  login(@Body() body: { email: string; password: string }) {
    return this.loginUserUseCase.execute(body);
  }
}

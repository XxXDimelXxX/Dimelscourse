import { Module } from "@nestjs/common";
import { AuthController } from "./infrastructure/auth.controller";
import {
  USER_REPOSITORY,
  type UserRepository,
} from "./domain/user.repository";
import { InMemoryUserRepository } from "./infrastructure/in-memory-user.repository";
import { LoginUserUseCase } from "./application/login-user.use-case";
import { RegisterUserUseCase } from "./application/register-user.use-case";

@Module({
  controllers: [AuthController],
  providers: [
    RegisterUserUseCase,
    LoginUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
  ],
})
export class IdentityAccessModule {}

export type IdentityUserRepository = UserRepository;

import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import {
  USER_REPOSITORY,
  type UserRepository,
} from "../domain/user.repository";

export interface LoginUserCommand {
  email: string;
  password: string;
}

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: LoginUserCommand) {
    const user = await this.userRepository.findByEmail(command.email);

    if (!user || user.passwordHash !== `hashed:${command.password}`) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      accessToken: `demo-token-for:${user.id.toString()}`,
      user: {
        id: user.id.toString(),
        email: user.email.value,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }
}

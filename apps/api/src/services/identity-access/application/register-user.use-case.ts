import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { User } from "../domain/user.entity";
import {
  USER_REPOSITORY,
  type UserRepository,
} from "../domain/user.repository";

export interface RegisterUserCommand {
  email: string;
  displayName: string;
  password: string;
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: RegisterUserCommand) {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    const user = User.register({
      email: command.email,
      displayName: command.displayName,
      passwordHash: `hashed:${command.password}`,
    });

    await this.userRepository.save(user);

    return {
      id: user.id.toString(),
      email: user.email.value,
      displayName: user.displayName,
      role: user.role,
    };
  }
}

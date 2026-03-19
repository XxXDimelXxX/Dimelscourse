import { Injectable } from "@nestjs/common";
import { UserRepository } from "../domain/user.repository";
import { User } from "../domain/user.entity";

@Injectable()
export class InMemoryUserRepository implements UserRepository {
  private readonly users = new Map<string, User>([
    [
      "student@email.com",
      User.register({
        email: "student@email.com",
        displayName: "Иван Петров",
        passwordHash: "hashed:password",
      }),
    ],
  ]);

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email.trim().toLowerCase()) ?? null;
  }

  async save(user: User): Promise<void> {
    this.users.set(user.email.value, user);
  }
}

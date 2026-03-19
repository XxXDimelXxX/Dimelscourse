import { AggregateRoot, UniqueEntityId } from "@dimelscourse/shared-kernel";
import { Email } from "./email.vo";

export type UserRole = "student" | "admin";

interface UserProps {
  email: Email;
  displayName: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(id: UniqueEntityId, props: UserProps) {
    super(id, props);
  }

  get email(): Email {
    return this.props.email;
  }

  get displayName(): string {
    return this.props.displayName;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): UserRole {
    return this.props.role;
  }

  static register(params: {
    id?: UniqueEntityId;
    email: string;
    displayName: string;
    passwordHash: string;
    role?: UserRole;
  }): User {
    return new User(params.id ?? UniqueEntityId.create(), {
      email: Email.create(params.email),
      displayName: params.displayName.trim(),
      passwordHash: params.passwordHash,
      role: params.role ?? "student",
      createdAt: new Date(),
    });
  }
}

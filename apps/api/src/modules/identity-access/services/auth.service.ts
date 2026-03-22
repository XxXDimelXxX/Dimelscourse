import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { UserEntity, UserRole } from "../entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: dto.email.trim().toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException("User already exists");
    }

    const user = this.usersRepository.create({
      email: dto.email,
      displayName: dto.displayName.trim(),
      passwordHash: this.hashPassword(dto.password),
      role: UserRole.STUDENT,
      isActive: true,
    });

    const savedUser = await this.usersRepository.save(user);

    return {
      id: savedUser.id,
      email: savedUser.email,
      displayName: savedUser.displayName,
      role: savedUser.role,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersRepository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :email", {
        email: dto.email.trim().toLowerCase(),
      })
      .getOne();

    if (!user || user.passwordHash !== this.hashPassword(dto.password)) {
      throw new UnauthorizedException("Invalid credentials");
    }

    return {
      accessToken: `demo-token-for:${user.id}`,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    };
  }

  private hashPassword(password: string): string {
    return `hashed:${password}`;
  }
}

import { Injectable } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { getAuthConfig } from "../../../core/config";

@Injectable()
export class PasswordService {
  async hash(password: string): Promise<string> {
    const config = getAuthConfig();
    return hash(password, config.bcryptSaltRounds);
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return compare(password, passwordHash);
  }
}

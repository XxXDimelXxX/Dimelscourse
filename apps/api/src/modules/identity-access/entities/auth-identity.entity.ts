import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./user.entity";

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
}

@Entity("auth_identities")
@Unique("UQ_auth_identity_provider_user_id", ["provider", "providerUserId"])
@Unique("UQ_auth_identity_provider_email", ["provider", "email"])
export class AuthIdentityEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({
    type: "enum",
    enum: AuthProvider,
  })
  provider!: AuthProvider;

  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.authIdentities, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Column({ name: "provider_user_id", length: 255, nullable: true })
  providerUserId!: string | null;

  @Column({ length: 255, nullable: true })
  email!: string | null;

  @Column({ name: "password_hash", nullable: true, select: false })
  passwordHash!: string | null;

  @Column({ name: "last_login_at", type: "timestamp", nullable: true })
  lastLoginAt!: Date | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail(): void {
    if (this.email) {
      this.email = this.email.trim().toLowerCase();
    }

    if (this.providerUserId && this.provider === AuthProvider.LOCAL) {
      this.providerUserId = this.providerUserId.trim().toLowerCase();
    }
  }
}

import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AuthIdentityEntity } from "./auth-identity.entity";
import { UserEntity } from "./user.entity";

@Entity("refresh_sessions")
export class RefreshSessionEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Index()
  @Column({ name: "user_id" })
  userId!: string;

  @ManyToOne(() => UserEntity, (user) => user.refreshSessions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @Index()
  @Column({ name: "auth_identity_id" })
  authIdentityId!: string;

  @ManyToOne(() => AuthIdentityEntity, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "auth_identity_id" })
  authIdentity!: AuthIdentityEntity;

  @Column({ name: "token_hash", length: 128 })
  tokenHash!: string;

  @Column({ name: "expires_at", type: "timestamp" })
  expiresAt!: Date;

  @Column({ name: "revoked_at", type: "timestamp", nullable: true })
  revokedAt!: Date | null;

  @Column({ name: "last_used_at", type: "timestamp", nullable: true })
  lastUsedAt!: Date | null;

  @Column({ name: "user_agent", type: "varchar", length: 500, nullable: true })
  userAgent!: string | null;

  @Column({ name: "ip_address", type: "varchar", length: 64, nullable: true })
  ipAddress!: string | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

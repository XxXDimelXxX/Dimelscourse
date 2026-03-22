import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { UserEntity } from "../../identity-access/entities/user.entity";

@Entity("achievements")
export class AchievementEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ length: 120 })
  title!: string;

  @Column({ type: "text" })
  description!: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  icon!: string | null;

  @Column({ length: 120, unique: true })
  code!: string;

  @ManyToOne(() => UserEntity, (user) => user.achievements, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @CreateDateColumn({ name: "unlocked_at" })
  unlockedAt!: Date;
}

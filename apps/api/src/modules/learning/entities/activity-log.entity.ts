import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";

export enum ActivityType {
  LESSON_COMPLETED = "lesson_completed",
  ACHIEVEMENT_UNLOCKED = "achievement_unlocked",
  QUIZ_COMPLETED = "quiz_completed",
  ENROLLED = "enrolled",
  RESOURCE_DOWNLOADED = "resource_downloaded",
}

@Entity("activity_logs")
export class ActivityLogEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "course_id", type: "uuid", nullable: true })
  courseId!: string | null;

  @Column({
    type: "enum",
    enum: ActivityType,
  })
  type!: ActivityType;

  @Column({ length: 180 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @ManyToOne(() => UserEntity, (user) => user.activityLogs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => CourseEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}

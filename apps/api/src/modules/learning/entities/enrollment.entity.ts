import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";
import { LessonProgressEntity } from "./lesson-progress.entity";

export enum EnrollmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  PAUSED = "paused",
}

@Entity("enrollments")
export class EnrollmentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "course_id", type: "uuid" })
  courseId!: string;

  @Column({
    type: "enum",
    enum: EnrollmentStatus,
    default: EnrollmentStatus.ACTIVE,
  })
  status!: EnrollmentStatus;

  @Column({ name: "progress_percent", type: "integer", default: 0 })
  progressPercent!: number;

  @Column({ name: "completed_lessons", type: "integer", default: 0 })
  completedLessons!: number;

  @Column({ name: "total_lessons", type: "integer", default: 0 })
  totalLessons!: number;

  @Column({ name: "next_lesson_title", type: "varchar", nullable: true })
  nextLessonTitle!: string | null;

  @Column({ name: "time_left_label", type: "varchar", nullable: true })
  timeLeftLabel!: string | null;

  @Column({ name: "completed_at", type: "timestamp", nullable: true })
  completedAt!: Date | null;

  @Column({ name: "last_activity_at", type: "timestamp", nullable: true })
  lastActivityAt!: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.enrollments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.enrollments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity;

  @OneToMany(() => LessonProgressEntity, (progress) => progress.enrollment)
  lessonProgresses!: LessonProgressEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

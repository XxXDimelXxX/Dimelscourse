import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LessonEntity } from "../../catalog/entities/lesson.entity";
import { EnrollmentEntity } from "./enrollment.entity";

@Entity("lesson_progress")
export class LessonProgressEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "enrollment_id", type: "uuid" })
  enrollmentId!: string;

  @Column({ name: "lesson_id", type: "uuid" })
  lessonId!: string;

  @Column({ name: "is_completed", default: false })
  isCompleted!: boolean;

  @Column({ name: "started_at", type: "timestamp", nullable: true })
  startedAt!: Date | null;

  @Column({ name: "completed_at", type: "timestamp", nullable: true })
  completedAt!: Date | null;

  @Column({ name: "watch_seconds", type: "integer", default: 0 })
  watchSeconds!: number;

  @ManyToOne(() => EnrollmentEntity, (enrollment) => enrollment.lessonProgresses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "enrollment_id" })
  enrollment!: EnrollmentEntity;

  @ManyToOne(() => LessonEntity, (lesson) => lesson.lessonProgresses, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "lesson_id" })
  lesson!: LessonEntity;
}

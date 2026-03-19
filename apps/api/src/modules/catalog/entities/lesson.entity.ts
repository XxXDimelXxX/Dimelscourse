import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LessonProgressEntity } from "../../learning/entities/lesson-progress.entity";
import { CourseEntity } from "./course.entity";
import { CourseModuleEntity } from "./course-module.entity";

@Entity("lessons")
export class LessonEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "uuid" })
  courseId!: string;

  @Column({ name: "course_module_id", type: "uuid" })
  courseModuleId!: string;

  @Column({ length: 180 })
  title!: string;

  @Column({ length: 180, unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  summary!: string | null;

  @Column({ name: "duration_minutes", type: "integer", default: 0 })
  durationMinutes!: number;

  @Column({ type: "integer" })
  position!: number;

  @Column({ name: "video_url", type: "varchar", nullable: true })
  videoUrl!: string | null;

  @Column({ name: "is_preview", default: false })
  isPreview!: boolean;

  @Column({ name: "is_locked_by_default", default: false })
  isLockedByDefault!: boolean;

  @ManyToOne(() => CourseEntity, (course) => course.lessons, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity;

  @ManyToOne(() => CourseModuleEntity, (courseModule) => courseModule.lessons, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_module_id" })
  courseModule!: CourseModuleEntity;

  @OneToMany(() => LessonProgressEntity, (progress) => progress.lesson)
  lessonProgresses!: LessonProgressEntity[];
}

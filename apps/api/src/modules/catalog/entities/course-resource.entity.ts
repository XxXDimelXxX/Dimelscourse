import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CourseEntity } from "./course.entity";
import { LessonEntity } from "./lesson.entity";

export enum ResourceType {
  PDF = "pdf",
  ZIP = "zip",
  LINK = "link",
  VIDEO = "video",
  IMAGE = "image",
}

@Entity("course_resources")
export class CourseResourceEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "uuid", nullable: true })
  courseId!: string | null;

  @Column({ name: "lesson_id", type: "uuid", nullable: true })
  lessonId!: string | null;

  @Column({ length: 180 })
  title!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "enum",
    enum: ResourceType,
    default: ResourceType.PDF,
  })
  type!: ResourceType;

  @Column({ name: "file_url", type: "varchar", nullable: true })
  fileUrl!: string | null;

  @Column({ name: "file_s3_key", type: "varchar", nullable: true })
  fileS3Key!: string | null;

  @Column({ name: "file_original_name", type: "varchar", nullable: true })
  fileOriginalName!: string | null;

  @Column({ name: "file_size_bytes", type: "bigint", nullable: true })
  fileSizeBytes!: number | null;

  @Column({ name: "file_size_label", type: "varchar", nullable: true })
  fileSizeLabel!: string | null;

  @Column({ type: "integer", default: 0 })
  position!: number;

  @ManyToOne(() => CourseEntity, (course) => course.resources, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity | null;

  @ManyToOne(() => LessonEntity, (lesson) => lesson.resources, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "lesson_id" })
  lesson!: LessonEntity | null;
}

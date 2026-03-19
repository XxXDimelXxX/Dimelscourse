import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CourseEntity } from "./course.entity";

export enum ResourceType {
  PDF = "pdf",
  ZIP = "zip",
  LINK = "link",
  VIDEO = "video",
}

@Entity("course_resources")
export class CourseResourceEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "uuid" })
  courseId!: string;

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

  @Column({ name: "file_size_label", type: "varchar", nullable: true })
  fileSizeLabel!: string | null;

  @Column({ type: "integer", default: 0 })
  position!: number;

  @ManyToOne(() => CourseEntity, (course) => course.resources, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity;
}

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CourseEntity } from "./course.entity";
import { LessonEntity } from "./lesson.entity";

@Entity("course_modules")
export class CourseModuleEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "uuid" })
  courseId!: string;

  @Column({ length: 180 })
  title!: string;

  @Column({ type: "integer" })
  position!: number;

  @ManyToOne(() => CourseEntity, (course) => course.courseModules, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity;

  @OneToMany(() => LessonEntity, (lesson) => lesson.courseModule)
  lessons!: LessonEntity[];
}

import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";

@Entity("course_comments")
export class CourseCommentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "course_id", type: "uuid" })
  courseId!: string;

  @Column({ name: "author_id", type: "uuid" })
  authorId!: string;

  @Column({ type: "text" })
  body!: string;

  @ManyToOne(() => CourseEntity, (course) => course.comments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity;

  @ManyToOne(() => UserEntity, (user) => user.courseComments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "author_id" })
  author!: UserEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

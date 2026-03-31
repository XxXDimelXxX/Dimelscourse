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
import { CourseCommentEntity } from "../../community/entities/course-comment.entity";
import { EnrollmentEntity } from "../../learning/entities/enrollment.entity";
import { PaymentEntity } from "../../payments/entities/payment.entity";
import { CourseModuleEntity } from "./course-module.entity";
import { CourseResourceEntity } from "./course-resource.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";
import { InstructorEntity } from "./instructor.entity";
import { LessonEntity } from "./lesson.entity";

export enum CourseLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

@Entity("courses")
export class CourseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 150 })
  slug!: string;

  @Column({ length: 180 })
  title!: string;

  @Column({ type: "text" })
  summary!: string;

  @Column({ type: "text", nullable: true })
  description!: string | null;

  @Column({
    type: "enum",
    enum: CourseLevel,
    default: CourseLevel.BEGINNER,
  })
  level!: CourseLevel;

  @Column({ name: "price_usd", type: "integer", default: 0 })
  priceUsd!: number;

  @Column({ name: "subscription_price_usd", type: "integer", default: 0 })
  subscriptionPriceUsd!: number;

  @Column({ name: "duration_label", length: 60 })
  durationLabel!: string;

  @Column({ name: "lesson_count", type: "integer", default: 0 })
  lessonCount!: number;

  @Column({ type: "decimal", precision: 3, scale: 2, default: 0 })
  rating!: string;

  @Column({ name: "students_count", type: "integer", default: 0 })
  studentsCount!: number;

  @Column({ name: "is_published", default: false })
  isPublished!: boolean;

  @Column({ name: "certificate_available", default: true })
  certificateAvailable!: boolean;

  @Column({ name: "preview_image_url", type: "varchar", nullable: true })
  previewImageUrl!: string | null;

  @Column({ name: "created_by_id", type: "uuid", nullable: true })
  createdById!: string | null;

  @ManyToOne(() => UserEntity, (user) => user.createdCourses, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "created_by_id" })
  createdBy!: UserEntity | null;

  @Column({ name: "instructor_id", type: "uuid", nullable: true })
  instructorId!: string | null;

  @ManyToOne(() => InstructorEntity, (instructor) => instructor.courses, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "instructor_id" })
  instructor!: InstructorEntity | null;

  @OneToMany(() => CourseModuleEntity, (courseModule) => courseModule.course)
  courseModules!: CourseModuleEntity[];

  @OneToMany(() => LessonEntity, (lesson) => lesson.course)
  lessons!: LessonEntity[];

  @OneToMany(() => CourseResourceEntity, (resource) => resource.course)
  resources!: CourseResourceEntity[];

  @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.course)
  enrollments!: EnrollmentEntity[];

  @OneToMany(() => PaymentEntity, (payment) => payment.course)
  payments!: PaymentEntity[];

  @OneToMany(() => CourseCommentEntity, (comment) => comment.course)
  comments!: CourseCommentEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

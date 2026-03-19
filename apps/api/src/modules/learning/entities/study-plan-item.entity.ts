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

@Entity("study_plan_items")
export class StudyPlanItemEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "course_id", type: "uuid", nullable: true })
  courseId!: string | null;

  @Column({ length: 3 })
  weekday!: string;

  @Column({ name: "day_of_month", type: "integer" })
  dayOfMonth!: number;

  @Column({ length: 180 })
  title!: string;

  @Column({ name: "time_range_label", length: 60 })
  timeRangeLabel!: string;

  @ManyToOne(() => UserEntity, (user) => user.studyPlanItems, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => CourseEntity, { nullable: true, onDelete: "SET NULL" })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity | null;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

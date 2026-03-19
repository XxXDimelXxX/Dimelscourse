import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { AchievementEntity } from "../../learning/entities/achievement.entity";
import { ActivityLogEntity } from "../../learning/entities/activity-log.entity";
import { EnrollmentEntity } from "../../learning/entities/enrollment.entity";
import { StudyPlanItemEntity } from "../../learning/entities/study-plan-item.entity";
import { CourseCommentEntity } from "../../community/entities/course-comment.entity";

export enum UserRole {
  STUDENT = "student",
  ADMIN = "admin",
  INSTRUCTOR = "instructor",
}

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true, length: 255 })
  email!: string;

  @Column({ name: "password_hash", select: false })
  passwordHash!: string;

  @Column({ name: "display_name", length: 120 })
  displayName!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @Column({ name: "is_active", default: true })
  isActive!: boolean;

  @Column({ name: "avatar_url", type: "varchar", nullable: true })
  avatarUrl!: string | null;

  @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.user)
  enrollments!: EnrollmentEntity[];

  @OneToMany(() => AchievementEntity, (achievement) => achievement.user)
  achievements!: AchievementEntity[];

  @OneToMany(() => ActivityLogEntity, (activity) => activity.user)
  activityLogs!: ActivityLogEntity[];

  @OneToMany(() => StudyPlanItemEntity, (studyPlanItem) => studyPlanItem.user)
  studyPlanItems!: StudyPlanItemEntity[];

  @OneToMany(() => CourseCommentEntity, (comment) => comment.author)
  courseComments!: CourseCommentEntity[];

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  normalizeEmail(): void {
    this.email = this.email.trim().toLowerCase();
  }
}

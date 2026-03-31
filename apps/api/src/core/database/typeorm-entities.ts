import { CourseCommentEntity } from "../../modules/community/entities/course-comment.entity";
import { CourseEntity } from "../../modules/catalog/entities/course.entity";
import { CourseModuleEntity } from "../../modules/catalog/entities/course-module.entity";
import { CourseResourceEntity } from "../../modules/catalog/entities/course-resource.entity";
import { InstructorEntity } from "../../modules/catalog/entities/instructor.entity";
import { LessonEntity } from "../../modules/catalog/entities/lesson.entity";
import { AuthIdentityEntity } from "../../modules/identity-access/entities/auth-identity.entity";
import { RefreshSessionEntity } from "../../modules/identity-access/entities/refresh-session.entity";
import { UserEntity } from "../../modules/identity-access/entities/user.entity";
import { AchievementEntity } from "../../modules/learning/entities/achievement.entity";
import { ActivityLogEntity } from "../../modules/learning/entities/activity-log.entity";
import { EnrollmentEntity } from "../../modules/learning/entities/enrollment.entity";
import { LessonProgressEntity } from "../../modules/learning/entities/lesson-progress.entity";
import { StudyPlanItemEntity } from "../../modules/learning/entities/study-plan-item.entity";
import { PaymentEntity } from "../../modules/payments/entities/payment.entity";

export const TYPEORM_ENTITIES = [
  UserEntity,
  AuthIdentityEntity,
  RefreshSessionEntity,
  InstructorEntity,
  CourseEntity,
  CourseModuleEntity,
  LessonEntity,
  CourseResourceEntity,
  EnrollmentEntity,
  LessonProgressEntity,
  AchievementEntity,
  ActivityLogEntity,
  StudyPlanItemEntity,
  CourseCommentEntity,
  PaymentEntity,
];

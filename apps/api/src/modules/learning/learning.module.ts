import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { S3Service } from "../../core/services/s3.service";
import { CourseEntity } from "../catalog/entities/course.entity";
import { LessonEntity } from "../catalog/entities/lesson.entity";
import { IdentityAccessModule } from "../identity-access/identity-access.module";
import { UserEntity } from "../identity-access/entities/user.entity";
import { DashboardController } from "./controllers/dashboard.controller";
import { LearningController } from "./controllers/learning.controller";
import { AchievementEntity } from "./entities/achievement.entity";
import { ActivityLogEntity } from "./entities/activity-log.entity";
import { EnrollmentEntity } from "./entities/enrollment.entity";
import { LessonProgressEntity } from "./entities/lesson-progress.entity";
import { StudyPlanItemEntity } from "./entities/study-plan-item.entity";
import { DashboardService } from "./services/dashboard.service";
import { EnrollmentService } from "./services/enrollment.service";
import { LearningService } from "./services/learning.service";

@Module({
  imports: [
    IdentityAccessModule,
    TypeOrmModule.forFeature([
      UserEntity,
      CourseEntity,
      LessonEntity,
      EnrollmentEntity,
      LessonProgressEntity,
      AchievementEntity,
      ActivityLogEntity,
      StudyPlanItemEntity,
    ]),
  ],
  controllers: [DashboardController, LearningController],
  providers: [DashboardService, EnrollmentService, LearningService, S3Service],
  exports: [TypeOrmModule, DashboardService, EnrollmentService, LearningService],
})
export class LearningModule {}

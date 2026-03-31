import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { S3Service } from "../../core/services/s3.service";
import { CourseEntity } from "../catalog/entities/course.entity";
import { CourseModuleEntity } from "../catalog/entities/course-module.entity";
import { CourseResourceEntity } from "../catalog/entities/course-resource.entity";
import { InstructorEntity } from "../catalog/entities/instructor.entity";
import { LessonEntity } from "../catalog/entities/lesson.entity";
import { IdentityAccessModule } from "../identity-access/identity-access.module";
import { UserEntity } from "../identity-access/entities/user.entity";
import { LearningModule } from "../learning/learning.module";
import { EnrollmentEntity } from "../learning/entities/enrollment.entity";
import { PaymentEntity } from "../payments/entities/payment.entity";
import { AdminController } from "./controllers/admin.controller";
import { AdminCoursesController } from "./controllers/admin-courses.controller";
import { AdminResourcesController } from "./controllers/admin-resources.controller";
import { VideoUploadController } from "./controllers/video-upload.controller";
import { AdminService } from "./services/admin.service";
import { AdminCoursesService } from "./services/admin-courses.service";
import { AdminResourcesService } from "./services/admin-resources.service";

@Module({
  imports: [
    IdentityAccessModule,
    LearningModule,
    TypeOrmModule.forFeature([
      UserEntity,
      EnrollmentEntity,
      PaymentEntity,
      CourseEntity,
      CourseModuleEntity,
      CourseResourceEntity,
      InstructorEntity,
      LessonEntity,
    ]),
  ],
  controllers: [
    AdminController,
    AdminCoursesController,
    AdminResourcesController,
    VideoUploadController,
  ],
  providers: [AdminService, AdminCoursesService, AdminResourcesService, S3Service],
})
export class AdminModule {}

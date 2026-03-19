import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CoursesController } from "./controllers/courses.controller";
import { CourseEntity } from "./entities/course.entity";
import { CourseModuleEntity } from "./entities/course-module.entity";
import { CourseResourceEntity } from "./entities/course-resource.entity";
import { InstructorEntity } from "./entities/instructor.entity";
import { LessonEntity } from "./entities/lesson.entity";
import { CoursesService } from "./services/courses.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InstructorEntity,
      CourseEntity,
      CourseModuleEntity,
      LessonEntity,
      CourseResourceEntity,
    ]),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [TypeOrmModule, CoursesService],
})
export class CatalogModule {}

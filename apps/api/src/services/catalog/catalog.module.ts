import { Module } from "@nestjs/common";
import { CatalogController } from "./infrastructure/catalog.controller";
import {
  COURSE_REPOSITORY,
} from "./domain/course.repository";
import { InMemoryCourseRepository } from "./infrastructure/in-memory-course.repository";
import { GetCourseDetailsUseCase } from "./application/get-course-details.use-case";
import { ListPublishedCoursesUseCase } from "./application/list-published-courses.use-case";

@Module({
  controllers: [CatalogController],
  providers: [
    GetCourseDetailsUseCase,
    ListPublishedCoursesUseCase,
    {
      provide: COURSE_REPOSITORY,
      useClass: InMemoryCourseRepository,
    },
  ],
  exports: [COURSE_REPOSITORY],
})
export class CatalogModule {}

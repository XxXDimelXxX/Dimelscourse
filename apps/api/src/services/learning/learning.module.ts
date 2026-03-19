import { Module } from "@nestjs/common";
import { StudentLearningController } from "./infrastructure/student-learning.controller";
import {
  ENROLLMENT_REPOSITORY,
  LESSON_PROGRESS_REPOSITORY,
} from "./domain/learning.repository";
import { InMemoryLearningRepository } from "./infrastructure/in-memory-learning.repository";
import { CompleteLessonUseCase } from "./application/complete-lesson.use-case";
import { GetStudentCourseUseCase } from "./application/get-student-course.use-case";
import { GetStudentDashboardUseCase } from "./application/get-student-dashboard.use-case";

@Module({
  controllers: [StudentLearningController],
  providers: [
    GetStudentDashboardUseCase,
    GetStudentCourseUseCase,
    CompleteLessonUseCase,
    InMemoryLearningRepository,
    {
      provide: ENROLLMENT_REPOSITORY,
      useExisting: InMemoryLearningRepository,
    },
    {
      provide: LESSON_PROGRESS_REPOSITORY,
      useExisting: InMemoryLearningRepository,
    },
  ],
})
export class LearningModule {}

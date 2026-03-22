import { Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { LearningService } from "../services/learning.service";

@Controller("me/courses")
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @Get(":courseSlug")
  getCourseWorkspace(
    @Param("courseSlug") courseSlug: string,
    @Query("userId") userId: string,
  ) {
    return this.learningService.getCourseWorkspace(userId, courseSlug);
  }

  @Patch(":courseSlug/lessons/:lessonId/complete")
  completeLesson(
    @Param("courseSlug") courseSlug: string,
    @Param("lessonId") lessonId: string,
    @Query("userId") userId: string,
  ) {
    return this.learningService.completeLesson(userId, courseSlug, lessonId);
  }
}

import { Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../identity-access/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../identity-access/guards/access-token.guard";
import { AuthenticatedUser } from "../../identity-access/interfaces/authenticated-user.interface";
import { LearningService } from "../services/learning.service";

@Controller("me/courses")
export class LearningController {
  constructor(private readonly learningService: LearningService) {}

  @UseGuards(AccessTokenGuard)
  @Get(":courseSlug")
  getCourseWorkspace(
    @Param("courseSlug") courseSlug: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.learningService.getCourseWorkspace(user.id, courseSlug);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(":courseSlug/lessons/:lessonId/complete")
  completeLesson(
    @Param("courseSlug") courseSlug: string,
    @Param("lessonId") lessonId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.learningService.completeLesson(user.id, courseSlug, lessonId);
  }
}

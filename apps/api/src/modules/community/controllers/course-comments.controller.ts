import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "../../identity-access/decorators/current-user.decorator";
import { AccessTokenGuard } from "../../identity-access/guards/access-token.guard";
import { AuthenticatedUser } from "../../identity-access/interfaces/authenticated-user.interface";
import { ZodValidationPipe } from "../../../core/pipes/zod-validation.pipe";
import {
  CreateCourseCommentDto,
  createCourseCommentSchema,
} from "../dto/create-course-comment.dto";
import { CourseCommentsService } from "../services/course-comments.service";

@Controller("courses/:courseSlug/comments")
export class CourseCommentsController {
  constructor(private readonly courseCommentsService: CourseCommentsService) {}

  @Get()
  list(@Param("courseSlug") courseSlug: string) {
    return this.courseCommentsService.listForCourse(courseSlug);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  create(
    @Param("courseSlug") courseSlug: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(createCourseCommentSchema))
    dto: CreateCourseCommentDto,
  ) {
    return this.courseCommentsService.createForCourse(courseSlug, user.id, dto);
  }
}

import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateCourseCommentDto } from "../dto/create-course-comment.dto";
import { CourseCommentsService } from "../services/course-comments.service";

@Controller("courses/:courseSlug/comments")
export class CourseCommentsController {
  constructor(private readonly courseCommentsService: CourseCommentsService) {}

  @Get()
  list(@Param("courseSlug") courseSlug: string) {
    return this.courseCommentsService.listForCourse(courseSlug);
  }

  @Post()
  create(
    @Param("courseSlug") courseSlug: string,
    @Body() dto: CreateCourseCommentDto,
  ) {
    return this.courseCommentsService.createForCourse(courseSlug, dto);
  }
}

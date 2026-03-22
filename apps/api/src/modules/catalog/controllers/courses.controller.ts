import { Controller, Get, Param } from "@nestjs/common";
import { CoursesService } from "../services/courses.service";

@Controller("courses")
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  listPublished() {
    return this.coursesService.findAllPublished();
  }

  @Get(":slug")
  getCourseDetails(@Param("slug") slug: string) {
    return this.coursesService.findBySlug(slug);
  }
}

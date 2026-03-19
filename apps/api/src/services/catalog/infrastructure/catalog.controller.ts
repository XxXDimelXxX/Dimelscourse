import { Controller, Get, Param } from "@nestjs/common";
import { GetCourseDetailsUseCase } from "../application/get-course-details.use-case";
import { ListPublishedCoursesUseCase } from "../application/list-published-courses.use-case";

@Controller("courses")
export class CatalogController {
  constructor(
    private readonly listPublishedCoursesUseCase: ListPublishedCoursesUseCase,
    private readonly getCourseDetailsUseCase: GetCourseDetailsUseCase,
  ) {}

  @Get()
  list() {
    return this.listPublishedCoursesUseCase.execute();
  }

  @Get(":slug")
  details(@Param("slug") slug: string) {
    return this.getCourseDetailsUseCase.execute(slug);
  }
}

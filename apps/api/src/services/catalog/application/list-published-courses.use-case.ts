import { Inject, Injectable } from "@nestjs/common";
import {
  COURSE_REPOSITORY,
  type CourseRepository,
} from "../domain/course.repository";

@Injectable()
export class ListPublishedCoursesUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute() {
    const courses = await this.courseRepository.findPublished();
    return courses.map((course) => course.toPrimitives());
  }
}

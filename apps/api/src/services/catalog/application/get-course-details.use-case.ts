import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  COURSE_REPOSITORY,
  type CourseRepository,
} from "../domain/course.repository";

@Injectable()
export class GetCourseDetailsUseCase {
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: CourseRepository,
  ) {}

  async execute(slug: string) {
    const course = await this.courseRepository.findBySlug(slug);

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    return course.toPrimitives();
  }
}

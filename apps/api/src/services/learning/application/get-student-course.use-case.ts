import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ENROLLMENT_REPOSITORY,
  LESSON_PROGRESS_REPOSITORY,
  type EnrollmentRepository,
  type LessonProgressRepository,
} from "../domain/learning.repository";

@Injectable()
export class GetStudentCourseUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
    @Inject(LESSON_PROGRESS_REPOSITORY)
    private readonly lessonProgressRepository: LessonProgressRepository,
  ) {}

  async execute(studentId: string, courseSlug: string) {
    const enrollment = await this.enrollmentRepository.findStudentCourse(
      studentId,
      courseSlug,
    );

    if (!enrollment) {
      throw new NotFoundException("Student is not enrolled in this course");
    }

    const lessons = await this.lessonProgressRepository.findByEnrollment(
      enrollment.id.toString(),
    );

    return {
      enrollment: enrollment.toPrimitives(),
      lessons: lessons.map((lesson) => lesson.toPrimitives()),
      resources: [
        { title: "Конспект модуля 1", format: "PDF", size: "2.4 MB" },
        { title: "Примеры кода", format: "ZIP", size: "1.8 MB" },
      ],
      discussion: [
        {
          author: "Алексей Морозов",
          createdAt: "2 дня назад",
          text: "Отличный курс! Особенно понравился модуль про React.",
        },
      ],
    };
  }
}

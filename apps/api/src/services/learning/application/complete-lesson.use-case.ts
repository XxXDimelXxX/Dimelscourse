import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  ENROLLMENT_REPOSITORY,
  LESSON_PROGRESS_REPOSITORY,
  type EnrollmentRepository,
  type LessonProgressRepository,
} from "../domain/learning.repository";

@Injectable()
export class CompleteLessonUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
    @Inject(LESSON_PROGRESS_REPOSITORY)
    private readonly lessonProgressRepository: LessonProgressRepository,
  ) {}

  async execute(studentId: string, courseSlug: string, lessonId: string) {
    const enrollment = await this.enrollmentRepository.findStudentCourse(
      studentId,
      courseSlug,
    );

    if (!enrollment) {
      throw new NotFoundException("Student is not enrolled in this course");
    }

    const lesson = await this.lessonProgressRepository.findOne(
      enrollment.id.toString(),
      lessonId,
    );

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    lesson.markCompleted();
    enrollment.completeLesson();

    await this.lessonProgressRepository.save(lesson);
    await this.enrollmentRepository.save(enrollment);

    return {
      enrollment: enrollment.toPrimitives(),
      lesson: lesson.toPrimitives(),
    };
  }
}

import { Enrollment } from "./enrollment.entity";
import { LessonProgress } from "./lesson-progress.entity";

export const ENROLLMENT_REPOSITORY = Symbol("ENROLLMENT_REPOSITORY");
export const LESSON_PROGRESS_REPOSITORY = Symbol("LESSON_PROGRESS_REPOSITORY");

export interface EnrollmentRepository {
  findByStudent(studentId: string): Promise<Enrollment[]>;
  findStudentCourse(studentId: string, courseSlug: string): Promise<Enrollment | null>;
  save(enrollment: Enrollment): Promise<void>;
}

export interface LessonProgressRepository {
  findByEnrollment(enrollmentId: string): Promise<LessonProgress[]>;
  findOne(enrollmentId: string, lessonId: string): Promise<LessonProgress | null>;
  save(progress: LessonProgress): Promise<void>;
}

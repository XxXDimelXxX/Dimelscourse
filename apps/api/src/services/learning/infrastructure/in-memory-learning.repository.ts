import { Injectable } from "@nestjs/common";
import { Enrollment } from "../domain/enrollment.entity";
import { LessonProgress } from "../domain/lesson-progress.entity";
import {
  type EnrollmentRepository,
  type LessonProgressRepository,
} from "../domain/learning.repository";

@Injectable()
export class InMemoryLearningRepository
  implements EnrollmentRepository, LessonProgressRepository
{
  private readonly enrollments = new Map<string, Enrollment>();
  private readonly lessonProgress = new Map<string, LessonProgress[]>();

  constructor() {
    const studentId = "student-1";
    const fullstack = Enrollment.create({
      studentId,
      courseId: "course-1",
      courseSlug: "fullstack",
      courseTitle: "Full Stack Web Development",
      progressPercent: 65,
      totalLessons: 120,
      completedLessons: 78,
      nextLessonTitle: "React Hooks - useContext",
      timeLeft: "2 месяца",
    });
    const python = Enrollment.create({
      studentId,
      courseId: "course-2",
      courseSlug: "python",
      courseTitle: "Python для начинающих",
      progressPercent: 100,
      totalLessons: 60,
      completedLessons: 60,
      nextLessonTitle: "Курс завершен",
      timeLeft: "Завершен",
    });
    const datascience = Enrollment.create({
      studentId,
      courseId: "course-3",
      courseSlug: "datascience",
      courseTitle: "Data Science & ML",
      progressPercent: 25,
      totalLessons: 150,
      completedLessons: 38,
      nextLessonTitle: "Pandas - Data Manipulation",
      timeLeft: "6 месяцев",
    });

    for (const enrollment of [fullstack, python, datascience]) {
      this.enrollments.set(this.key(enrollment.toPrimitives().studentId, enrollment.courseSlug), enrollment);
    }

    this.lessonProgress.set(fullstack.id.toString(), [
      LessonProgress.create({
        enrollmentId: fullstack.id.toString(),
        lessonId: "html-intro",
        lessonTitle: "Введение в HTML",
        duration: "15 мин",
        completed: true,
      }),
      LessonProgress.create({
        enrollmentId: fullstack.id.toString(),
        lessonId: "html-structure",
        lessonTitle: "HTML теги и структура",
        duration: "20 мин",
        completed: true,
      }),
      LessonProgress.create({
        enrollmentId: fullstack.id.toString(),
        lessonId: "javascript-arrays",
        lessonTitle: "Массивы и объекты",
        duration: "30 мин",
        completed: false,
      }),
      LessonProgress.create({
        enrollmentId: fullstack.id.toString(),
        lessonId: "nodejs-setup",
        lessonTitle: "Настройка Node",
        duration: "15 мин",
        completed: false,
        locked: true,
      }),
    ]);
  }

  async findByStudent(studentId: string): Promise<Enrollment[]> {
    return [...this.enrollments.values()].filter(
      (enrollment) => enrollment.toPrimitives().studentId === studentId,
    );
  }

  async findStudentCourse(
    studentId: string,
    courseSlug: string,
  ): Promise<Enrollment | null> {
    return this.enrollments.get(this.key(studentId, courseSlug)) ?? null;
  }

  async save(enrollment: Enrollment): Promise<void> {
    this.enrollments.set(
      this.key(enrollment.toPrimitives().studentId, enrollment.courseSlug),
      enrollment,
    );
  }

  async findByEnrollment(enrollmentId: string): Promise<LessonProgress[]> {
    return this.lessonProgress.get(enrollmentId) ?? [];
  }

  async findOne(
    enrollmentId: string,
    lessonId: string,
  ): Promise<LessonProgress | null> {
    const lessons = this.lessonProgress.get(enrollmentId) ?? [];
    return lessons.find((lesson) => lesson.lessonId === lessonId) ?? null;
  }

  async save(progress: LessonProgress): Promise<void> {
    const lessons = this.lessonProgress.get(progress.enrollmentId) ?? [];
    const nextLessons = lessons.map((lesson) =>
      lesson.lessonId === progress.lessonId ? progress : lesson,
    );
    this.lessonProgress.set(progress.enrollmentId, nextLessons);
  }

  private key(studentId: string, courseSlug: string): string {
    return `${studentId}:${courseSlug}`;
  }
}

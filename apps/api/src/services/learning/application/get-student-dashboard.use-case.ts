import { Inject, Injectable } from "@nestjs/common";
import {
  ENROLLMENT_REPOSITORY,
  type EnrollmentRepository,
} from "../domain/learning.repository";

@Injectable()
export class GetStudentDashboardUseCase {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  async execute(studentId: string) {
    const enrollments = await this.enrollmentRepository.findByStudent(studentId);
    const courses = enrollments.map((enrollment) => enrollment.toPrimitives());

    const completedLessons = courses.reduce(
      (sum, course) => sum + course.completedLessons,
      0,
    );

    return {
      profile: {
        displayName: "Иван Петров",
        email: "student@email.com",
        level: "Intermediate",
        ratingLabel: "#127 из 10,000",
      },
      stats: {
        activeCourses: courses.length,
        completedLessons,
        studyHours: 127,
        achievements: 4,
      },
      courses,
      recentActivity: [
        {
          type: "lesson_completed",
          title: 'Урок завершен: "React Hooks - useState"',
          happenedAt: "2 часа назад",
        },
        {
          type: "achievement_unlocked",
          title: 'Получено достижение: "100 уроков"',
          happenedAt: "Вчера",
        },
      ],
      achievements: [
        { title: "Первый курс", description: "Завершил первый курс" },
        { title: "Неделя подряд", description: "7 дней активности" },
        { title: "100 уроков", description: "Пройдено 100 уроков" },
        { title: "Отличник", description: "Все тесты на 90%+" },
      ],
      studyPlan: [
        {
          weekday: "ПН",
          dayOfMonth: 17,
          title: "React Advanced Patterns",
          timeRange: "14:00 - 16:00",
        },
        {
          weekday: "СР",
          dayOfMonth: 19,
          title: "Node.js Backend",
          timeRange: "15:00 - 17:00",
        },
      ],
    };
  }
}

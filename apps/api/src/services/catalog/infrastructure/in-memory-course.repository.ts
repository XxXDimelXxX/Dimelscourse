import { Injectable } from "@nestjs/common";
import { Course } from "../domain/course.entity";
import { CourseRepository } from "../domain/course.repository";

@Injectable()
export class InMemoryCourseRepository implements CourseRepository {
  private readonly courses: Course[] = [
    Course.create({
      slug: "fullstack",
      title: "Full Stack Web Development",
      summary: "Полный курс по React, Node.js и проектированию приложений.",
      level: "popular",
      duration: "6 месяцев",
      lessonCount: 120,
      priceUsd: 299,
      instructorName: "Дмитрий Иванов",
      isPublished: true,
    }),
    Course.create({
      slug: "python",
      title: "Python для начинающих",
      summary: "Базовый курс для входа в разработку через Python.",
      level: "beginner",
      duration: "3 месяца",
      lessonCount: 60,
      priceUsd: 149,
      instructorName: "Анна Смирнова",
      isPublished: true,
    }),
    Course.create({
      slug: "datascience",
      title: "Data Science & ML",
      summary: "Продвинутый курс по аналитике данных и ML.",
      level: "advanced",
      duration: "8 месяцев",
      lessonCount: 150,
      priceUsd: 399,
      instructorName: "Петр Козлов",
      isPublished: true,
    }),
  ];

  async findPublished(): Promise<Course[]> {
    return this.courses.filter((course) => course.toPrimitives().isPublished);
  }

  async findBySlug(slug: string): Promise<Course | null> {
    return this.courses.find((course) => course.slug === slug) ?? null;
  }
}

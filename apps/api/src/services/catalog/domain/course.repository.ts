import { Course } from "./course.entity";

export const COURSE_REPOSITORY = Symbol("COURSE_REPOSITORY");

export interface CourseRepository {
  findPublished(): Promise<Course[]>;
  findBySlug(slug: string): Promise<Course | null>;
}

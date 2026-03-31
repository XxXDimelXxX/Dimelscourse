import { CourseModuleEntity } from "../../modules/catalog/entities/course-module.entity";
import { LessonEntity } from "../../modules/catalog/entities/lesson.entity";

/**
 * Sorts course modules and flattens lessons in positional order.
 * Used across learning, payments, and admin modules.
 */
export function getSortedLessons(courseModules: CourseModuleEntity[]): LessonEntity[] {
  return [...(courseModules ?? [])]
    .sort((left, right) => left.position - right.position)
    .flatMap((courseModule) =>
      [...(courseModule.lessons ?? [])].sort((left, right) => left.position - right.position),
    );
}

/**
 * Sorts course modules with their nested lessons in positional order.
 */
export function getSortedModules(courseModules: CourseModuleEntity[]): CourseModuleEntity[] {
  return [...(courseModules ?? [])]
    .sort((left, right) => left.position - right.position)
    .map((courseModule) => ({
      ...courseModule,
      lessons: [...(courseModule.lessons ?? [])].sort(
        (left, right) => left.position - right.position,
      ),
    }));
}
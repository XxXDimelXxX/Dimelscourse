import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CourseEntity } from "../entities/course.entity";

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,
  ) {}

  async findAllPublished() {
    const courses = await this.coursesRepository.find({
      where: { isPublished: true },
      relations: {
        instructor: true,
        courseModules: {
          lessons: true,
        },
        resources: true,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return courses.map((course) => this.toCourseCard(course));
  }

  async findBySlug(slug: string) {
    const course = await this.coursesRepository.findOne({
      where: { slug },
      relations: {
        instructor: true,
        courseModules: {
          lessons: true,
        },
        resources: true,
      },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      summary: course.summary,
      description: course.description,
      level: course.level,
      duration: course.durationLabel,
      lessonCount: course.lessonCount,
      rating: Number(course.rating),
      studentsCount: course.studentsCount,
      priceUsd: course.priceUsd,
      certificateAvailable: course.certificateAvailable,
      previewImageUrl: course.previewImageUrl,
      instructor: course.instructor
        ? {
            id: course.instructor.id,
            fullName: course.instructor.fullName,
            title: course.instructor.title,
            bio: course.instructor.bio,
            avatarUrl: course.instructor.avatarUrl,
            yearsOfExperience: course.instructor.yearsOfExperience,
          }
        : null,
      modules: [...(course.courseModules ?? [])]
        .sort((left, right) => left.position - right.position)
        .map((courseModule) => ({
          id: courseModule.id,
          title: courseModule.title,
          position: courseModule.position,
          lessons: [...(courseModule.lessons ?? [])]
            .sort((left, right) => left.position - right.position)
            .map((lesson) => ({
              id: lesson.id,
              slug: lesson.slug,
              title: lesson.title,
              summary: lesson.summary,
              durationMinutes: lesson.durationMinutes,
              isPreview: lesson.isPreview,
              isLockedByDefault: lesson.isLockedByDefault,
              position: lesson.position,
            })),
        })),
      resources: [...(course.resources ?? [])]
        .sort((left, right) => left.position - right.position)
        .map((resource) => ({
          id: resource.id,
          title: resource.title,
          description: resource.description,
          type: resource.type,
          fileUrl: resource.fileUrl,
          fileSizeLabel: resource.fileSizeLabel,
        })),
    };
  }

  private toCourseCard(course: CourseEntity) {
    return {
      id: course.id,
      slug: course.slug,
      title: course.title,
      summary: course.summary,
      level: course.level,
      duration: course.durationLabel,
      lessonCount: course.lessonCount,
      rating: Number(course.rating),
      studentsCount: course.studentsCount,
      priceUsd: course.priceUsd,
      previewImageUrl: course.previewImageUrl,
      instructorName: course.instructor?.fullName ?? null,
    };
  }
}

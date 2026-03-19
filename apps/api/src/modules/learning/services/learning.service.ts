import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { LessonEntity } from "../../catalog/entities/lesson.entity";
import { EnrollmentEntity, EnrollmentStatus } from "../entities/enrollment.entity";
import { LessonProgressEntity } from "../entities/lesson-progress.entity";

@Injectable()
export class LearningService {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentEntity>,
    @InjectRepository(LessonProgressEntity)
    private readonly lessonProgressRepository: Repository<LessonProgressEntity>,
    @InjectRepository(LessonEntity)
    private readonly lessonsRepository: Repository<LessonEntity>,
  ) {}

  async getCourseWorkspace(userId: string, courseSlug: string) {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: {
        userId,
        course: { slug: courseSlug },
      },
      relations: {
        course: {
          instructor: true,
          courseModules: {
            lessons: true,
          },
          resources: true,
        },
        lessonProgresses: {
          lesson: true,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException("Enrollment not found");
    }

    const progressByLessonId = new Map(
      (enrollment.lessonProgresses ?? []).map((progress) => [
        progress.lessonId,
        progress,
      ]),
    );

    return {
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        progressPercent: enrollment.progressPercent,
        completedLessons: enrollment.completedLessons,
        totalLessons: enrollment.totalLessons,
        nextLessonTitle: enrollment.nextLessonTitle,
      },
      course: {
        id: enrollment.course.id,
        slug: enrollment.course.slug,
        title: enrollment.course.title,
        summary: enrollment.course.summary,
        description: enrollment.course.description,
        duration: enrollment.course.durationLabel,
        rating: Number(enrollment.course.rating),
        studentsCount: enrollment.course.studentsCount,
        instructor: enrollment.course.instructor
          ? {
              id: enrollment.course.instructor.id,
              fullName: enrollment.course.instructor.fullName,
              title: enrollment.course.instructor.title,
              bio: enrollment.course.instructor.bio,
            }
          : null,
        modules: [...(enrollment.course.courseModules ?? [])]
          .sort((left, right) => left.position - right.position)
          .map((courseModule) => ({
            id: courseModule.id,
            title: courseModule.title,
            position: courseModule.position,
            lessons: [...(courseModule.lessons ?? [])]
              .sort((left, right) => left.position - right.position)
              .map((lesson) => {
                const progress = progressByLessonId.get(lesson.id);

                return {
                  id: lesson.id,
                  slug: lesson.slug,
                  title: lesson.title,
                  summary: lesson.summary,
                  durationMinutes: lesson.durationMinutes,
                  position: lesson.position,
                  completed: progress?.isCompleted ?? false,
                  locked: lesson.isLockedByDefault && !(progress?.isCompleted ?? false),
                  completedAt: progress?.completedAt ?? null,
                };
              }),
          })),
        resources: [...(enrollment.course.resources ?? [])]
          .sort((left, right) => left.position - right.position)
          .map((resource) => ({
            id: resource.id,
            title: resource.title,
            description: resource.description,
            type: resource.type,
            fileUrl: resource.fileUrl,
            fileSizeLabel: resource.fileSizeLabel,
          })),
      },
    };
  }

  async completeLesson(userId: string, courseSlug: string, lessonId: string) {
    const enrollment = await this.enrollmentsRepository.findOne({
      where: {
        userId,
        course: { slug: courseSlug },
      },
      relations: {
        course: {
          courseModules: {
            lessons: true,
          },
        },
        lessonProgresses: {
          lesson: true,
        },
      },
    });

    if (!enrollment) {
      throw new NotFoundException("Enrollment not found");
    }

    const lesson = await this.lessonsRepository.findOne({
      where: { id: lessonId, course: { slug: courseSlug } },
    });

    if (!lesson) {
      throw new NotFoundException("Lesson not found");
    }

    let progress = enrollment.lessonProgresses.find(
      (item) => item.lessonId === lesson.id,
    );

    if (!progress) {
      progress = this.lessonProgressRepository.create({
        enrollmentId: enrollment.id,
        lessonId: lesson.id,
        startedAt: new Date(),
        isCompleted: false,
        watchSeconds: 0,
      });
    }

    progress.isCompleted = true;
    progress.startedAt = progress.startedAt ?? new Date();
    progress.completedAt = new Date();

    await this.lessonProgressRepository.save(progress);

    const sortedLessons = (enrollment.course.courseModules ?? [])
      .flatMap((courseModule) => courseModule.lessons ?? [])
      .sort((left, right) => left.position - right.position);

    const lessonIds = new Set(sortedLessons.map((item) => item.id));
    const completedIds = new Set(
      [
        ...enrollment.lessonProgresses.filter((item) => item.isCompleted).map((item) => item.lessonId),
        progress.lessonId,
      ].filter((item) => lessonIds.has(item)),
    );

    enrollment.totalLessons = sortedLessons.length;
    enrollment.completedLessons = completedIds.size;
    enrollment.progressPercent =
      sortedLessons.length === 0
        ? 0
        : Math.round((completedIds.size / sortedLessons.length) * 100);

    const nextLesson = sortedLessons.find((item) => !completedIds.has(item.id));
    enrollment.nextLessonTitle = nextLesson?.title ?? "Курс завершен";
    enrollment.lastActivityAt = new Date();

    if (completedIds.size === sortedLessons.length && sortedLessons.length > 0) {
      enrollment.status = EnrollmentStatus.COMPLETED;
      enrollment.completedAt = new Date();
      enrollment.timeLeftLabel = "Завершен";
    }

    await this.enrollmentsRepository.save(enrollment);

    return {
      enrollmentId: enrollment.id,
      lessonId: lesson.id,
      progressPercent: enrollment.progressPercent,
      completedLessons: enrollment.completedLessons,
      totalLessons: enrollment.totalLessons,
      nextLessonTitle: enrollment.nextLessonTitle,
      status: enrollment.status,
    };
  }
}

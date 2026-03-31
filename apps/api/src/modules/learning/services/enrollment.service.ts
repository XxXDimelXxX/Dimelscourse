import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { getSortedLessons } from "../../../core/utils/course.utils";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { EnrollmentEntity, EnrollmentStatus } from "../entities/enrollment.entity";

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentEntity>,
    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,
  ) {}

  /**
   * Grants course access: creates a new enrollment or reactivates an existing one.
   * Used by both payment flow and admin manual access grant.
   */
  async grantAccess(userId: string, courseId: string): Promise<EnrollmentEntity> {
    const course = await this.coursesRepository.findOne({
      where: { id: courseId },
      relations: { courseModules: { lessons: true } },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    const lessons = getSortedLessons(course.courseModules ?? []);
    const nextLessonTitle = lessons[0]?.title ?? null;

    const existing = await this.enrollmentsRepository.findOne({
      where: { userId, courseId },
    });

    if (existing) {
      existing.status =
        existing.progressPercent === 100
          ? EnrollmentStatus.COMPLETED
          : EnrollmentStatus.ACTIVE;
      existing.totalLessons = lessons.length;
      existing.nextLessonTitle =
        existing.progressPercent === 100 ? "Курс завершен" : nextLessonTitle;
      existing.timeLeftLabel =
        existing.progressPercent === 100 ? "Завершен" : "В процессе";
      existing.lastActivityAt = new Date();
      return this.enrollmentsRepository.save(existing);
    }

    return this.enrollmentsRepository.save(
      this.enrollmentsRepository.create({
        userId,
        courseId,
        status: EnrollmentStatus.ACTIVE,
        progressPercent: 0,
        completedLessons: 0,
        totalLessons: lessons.length,
        nextLessonTitle: nextLessonTitle,
        timeLeftLabel: "В процессе",
        completedAt: null,
        lastActivityAt: new Date(),
      }),
    );
  }

  /**
   * Revokes course access by pausing the enrollment.
   */
  async revokeAccess(userId: string, courseId: string): Promise<void> {
    const existing = await this.enrollmentsRepository.findOne({
      where: { userId, courseId },
    });

    if (existing) {
      existing.status = EnrollmentStatus.PAUSED;
      existing.timeLeftLabel = "Доступ остановлен";
      await this.enrollmentsRepository.save(existing);
    }
  }
}

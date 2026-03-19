import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../identity-access/entities/user.entity";
import { AchievementEntity } from "../entities/achievement.entity";
import { ActivityLogEntity } from "../entities/activity-log.entity";
import { EnrollmentEntity } from "../entities/enrollment.entity";
import { StudyPlanItemEntity } from "../entities/study-plan-item.entity";

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentEntity>,
    @InjectRepository(AchievementEntity)
    private readonly achievementsRepository: Repository<AchievementEntity>,
    @InjectRepository(ActivityLogEntity)
    private readonly activityLogsRepository: Repository<ActivityLogEntity>,
    @InjectRepository(StudyPlanItemEntity)
    private readonly studyPlanItemsRepository: Repository<StudyPlanItemEntity>,
  ) {}

  async getStudentDashboard(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const [enrollments, achievements, recentActivity, studyPlan] = await Promise.all([
      this.enrollmentsRepository.find({
        where: { userId },
        relations: {
          course: true,
        },
        order: { createdAt: "DESC" },
      }),
      this.achievementsRepository.find({
        where: { userId },
        order: { unlockedAt: "DESC" },
      }),
      this.activityLogsRepository.find({
        where: { userId },
        relations: { course: true },
        order: { createdAt: "DESC" },
        take: 10,
      }),
      this.studyPlanItemsRepository.find({
        where: { userId },
        relations: { course: true },
        order: { dayOfMonth: "ASC" },
      }),
    ]);

    const completedLessons = enrollments.reduce(
      (sum, enrollment) => sum + enrollment.completedLessons,
      0,
    );

    return {
      profile: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
      stats: {
        activeCourses: enrollments.length,
        completedLessons,
        studyHours: Math.round(completedLessons * 1.5),
        achievements: achievements.length,
      },
      courses: enrollments.map((enrollment) => ({
        enrollmentId: enrollment.id,
        courseId: enrollment.courseId,
        courseSlug: enrollment.course.slug,
        title: enrollment.course.title,
        progress: enrollment.progressPercent,
        nextLesson: enrollment.nextLessonTitle,
        totalLessons: enrollment.totalLessons,
        completedLessons: enrollment.completedLessons,
        timeLeft: enrollment.timeLeftLabel,
        status: enrollment.status,
      })),
      achievements: achievements.map((achievement) => ({
        id: achievement.id,
        code: achievement.code,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        unlockedAt: achievement.unlockedAt,
      })),
      recentActivity: recentActivity.map((activity) => ({
        id: activity.id,
        type: activity.type,
        title: activity.title,
        description: activity.description,
        courseTitle: activity.course?.title ?? null,
        createdAt: activity.createdAt,
      })),
      studyPlan: studyPlan.map((item) => ({
        id: item.id,
        weekday: item.weekday,
        dayOfMonth: item.dayOfMonth,
        title: item.title,
        timeRange: item.timeRangeLabel,
        courseId: item.courseId,
      })),
    };
  }
}

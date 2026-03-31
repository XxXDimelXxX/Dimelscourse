import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { getSortedModules } from "../../../core/utils/course.utils";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { InstructorEntity } from "../../catalog/entities/instructor.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";
import {
  EnrollmentEntity,
  EnrollmentStatus,
} from "../../learning/entities/enrollment.entity";
import { EnrollmentService } from "../../learning/services/enrollment.service";
import { PaymentEntity, PaymentStatus } from "../../payments/entities/payment.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,
    @InjectRepository(InstructorEntity)
    private readonly instructorsRepository: Repository<InstructorEntity>,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  async getOverview() {
    const [users, enrollments, payments] = await Promise.all([
      this.usersRepository.find({
        order: { createdAt: "DESC" },
      }),
      this.enrollmentsRepository.find({
        relations: { course: true },
      }),
      this.paymentsRepository.find({
        relations: { user: true, course: true },
        order: { createdAt: "DESC" },
        take: 20,
      }),
    ]);

    const accessibleEnrollments = enrollments.filter(
      (enrollment) => enrollment.status !== EnrollmentStatus.PAUSED,
    );
    const successfulPayments = payments.filter(
      (payment) => payment.status === PaymentStatus.SUCCESS,
    );
    const completionRate =
      accessibleEnrollments.length === 0
        ? 0
        : Math.round(
            accessibleEnrollments.reduce(
              (sum, enrollment) => sum + enrollment.progressPercent,
              0,
            ) / accessibleEnrollments.length,
          );

    return {
      stats: {
        totalUsers: users.length,
        activeSubscriptions: successfulPayments.filter(
          (payment) => payment.type === "subscription",
        ).length,
        totalRevenue: successfulPayments.reduce(
          (sum, payment) => sum + payment.amountUsd,
          0,
        ),
        completionRate,
      },
      recentPayments: payments.slice(0, 5).map((payment) => ({
        id: payment.id,
        user: payment.user?.email ?? "unknown",
        amount: payment.amountUsd,
        type: payment.type,
        status: payment.status,
        date: payment.createdAt,
      })),
      recentUsers: users.slice(0, 5).map((user) => {
        const enrollment = accessibleEnrollments.find(
          (item) => item.userId === user.id,
        );

        return {
          id: user.id,
          name: user.displayName,
          email: user.email,
          hasAccess: Boolean(enrollment),
          progress: enrollment?.progressPercent ?? 0,
          joined: user.createdAt,
        };
      }),
    };
  }

  async getUsers() {
    const [users, enrollments, payments] = await Promise.all([
      this.usersRepository.find({
        order: { createdAt: "DESC" },
      }),
      this.enrollmentsRepository.find({
        relations: { course: true },
      }),
      this.paymentsRepository.find({
        order: { createdAt: "DESC" },
      }),
    ]);

    return users.map((user) => {
      const userEnrollments = enrollments
        .filter(
          (enrollment) =>
            enrollment.userId === user.id &&
            enrollment.status !== EnrollmentStatus.PAUSED,
        )
        .sort(
          (left, right) =>
            right.updatedAt.getTime() - left.updatedAt.getTime(),
        );
      const latestPayment = payments.find(
        (payment) =>
          payment.userId === user.id && payment.status === PaymentStatus.SUCCESS,
      );
      const enrollment = userEnrollments[0];

      return {
        id: user.id,
        name: user.displayName,
        email: user.email,
        hasAccess: Boolean(enrollment),
        progress: enrollment?.progressPercent ?? 0,
        completedLessons: enrollment?.completedLessons ?? 0,
        totalLessons: enrollment?.totalLessons ?? 0,
        joined: user.createdAt,
        lastActive: enrollment?.lastActivityAt ?? user.updatedAt,
        subscriptionType: latestPayment?.type ?? "none",
      };
    });
  }

  async toggleUserAccess(userId: string, input: { grant: boolean; courseSlug?: string }) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    const course = input.courseSlug
      ? await this.coursesRepository.findOne({ where: { slug: input.courseSlug } })
      : await this.coursesRepository.findOne({
          where: { isPublished: true },
          order: { createdAt: "ASC" },
        });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    if (input.grant) {
      await this.enrollmentService.grantAccess(userId, course.id);
    } else {
      await this.enrollmentService.revokeAccess(userId, course.id);
    }

    return { success: true };
  }

  async getPayments() {
    const payments = await this.paymentsRepository.find({
      relations: {
        user: true,
      },
      order: { createdAt: "DESC" },
    });

    return payments.map((payment) => ({
      id: payment.id,
      userId: payment.userId,
      userName: payment.user?.displayName ?? "Unknown",
      userEmail: payment.user?.email ?? "unknown@example.com",
      amount: payment.amountUsd,
      type: payment.type,
      status: payment.status,
      date: payment.createdAt,
      paymentMethod: payment.paymentMethodLabel ?? "Unknown",
      transactionId: payment.transactionId,
    }));
  }

  async getCourse(slug: string) {
    const course = await this.coursesRepository.findOne({
      where: { slug },
      relations: {
        instructor: true,
        courseModules: {
          lessons: true,
        },
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
      priceUsd: course.priceUsd,
      subscriptionPriceUsd: course.subscriptionPriceUsd,
      duration: course.durationLabel,
      instructorName: course.instructor?.fullName ?? "",
      modules: getSortedModules(course.courseModules ?? []).map((courseModule) => ({
        id: courseModule.id,
        title: courseModule.title,
        lessons: courseModule.lessons.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.summary,
          duration: `${lesson.durationMinutes} мин`,
          videoOriginalName: lesson.videoOriginalName,
        })),
      })),
    };
  }

  async updateCourse(
    slug: string,
    input: {
      title?: string;
      description?: string;
      priceUsd?: number;
      subscriptionPriceUsd?: number;
      instructorName?: string;
    },
  ) {
    const course = await this.coursesRepository.findOne({
      where: { slug },
      relations: { instructor: true },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    if (typeof input.title === "string" && input.title.trim()) {
      course.title = input.title.trim();
    }

    if (typeof input.description === "string") {
      course.description = input.description.trim();
    }

    if (typeof input.priceUsd === "number" && Number.isFinite(input.priceUsd)) {
      course.priceUsd = Math.max(0, Math.round(input.priceUsd));
    }

    if (
      typeof input.subscriptionPriceUsd === "number" &&
      Number.isFinite(input.subscriptionPriceUsd)
    ) {
      course.subscriptionPriceUsd = Math.max(
        0,
        Math.round(input.subscriptionPriceUsd),
      );
    }

    if (
      course.instructor &&
      typeof input.instructorName === "string" &&
      input.instructorName.trim()
    ) {
      course.instructor.fullName = input.instructorName.trim();
      await this.instructorsRepository.save(course.instructor);
    }

    await this.coursesRepository.save(course);
    return this.getCourse(slug);
  }
}

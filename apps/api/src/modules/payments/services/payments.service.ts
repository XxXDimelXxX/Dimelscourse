import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";
import {
  EnrollmentEntity,
  EnrollmentStatus,
} from "../../learning/entities/enrollment.entity";
import { PaymentEntity, PaymentStatus, PaymentType } from "../entities/payment.entity";

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentEntity>,
  ) {}

  async createCheckout(input: {
    userId: string;
    courseSlug: string;
    paymentType: PaymentType;
    paymentMethodLabel?: string;
  }) {
    const [user, course] = await Promise.all([
      this.usersRepository.findOne({ where: { id: input.userId } }),
      this.coursesRepository.findOne({
        where: { slug: input.courseSlug },
        relations: {
          courseModules: {
            lessons: true,
          },
        },
      }),
    ]);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    const existingEnrollment = await this.enrollmentsRepository.findOne({
      where: {
        userId: user.id,
        courseId: course.id,
        status: In([EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED]),
      },
    });

    if (existingEnrollment) {
      return {
        id: `existing-${existingEnrollment.id}`,
        status: PaymentStatus.SUCCESS,
        type: input.paymentType,
        amountUsd: this.resolveAmount(course, input.paymentType),
        courseSlug: course.slug,
        accessGranted: true,
        transactionId: `existing-${existingEnrollment.id}`,
        paymentMethodLabel: input.paymentMethodLabel ?? "Already granted",
      };
    }

    const payment = this.paymentsRepository.create({
      userId: user.id,
      courseId: course.id,
      type: input.paymentType,
      status: PaymentStatus.PENDING,
      amountUsd: this.resolveAmount(course, input.paymentType),
      currency: "USD",
      provider: "demo-gateway",
      transactionId: `txn_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      paymentMethodLabel: input.paymentMethodLabel ?? "Visa •••• 4242",
      accessGranted: false,
    });

    const savedPayment = await this.paymentsRepository.save(payment);
    return this.toPaymentDto(savedPayment, user, course);
  }

  async processWebhook(input: {
    paymentId: string;
    status: PaymentStatus;
    eventId?: string;
    failureReason?: string;
  }) {
    const payment = await this.paymentsRepository.findOne({
      where: { id: input.paymentId },
      relations: {
        user: true,
        course: {
          courseModules: {
            lessons: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException("Payment not found");
    }

    payment.status = input.status;
    payment.webhookEventId = input.eventId ?? payment.webhookEventId;
    payment.failureReason =
      input.status === PaymentStatus.FAILED
        ? input.failureReason ?? "Платеж отклонен провайдером"
        : null;

    if (input.status === PaymentStatus.SUCCESS && !payment.accessGranted) {
      await this.ensureCourseAccess(payment);
      payment.accessGranted = true;
      payment.accessGrantedAt = new Date();
    }

    const savedPayment = await this.paymentsRepository.save(payment);
    return this.toPaymentDto(savedPayment, payment.user, payment.course);
  }

  private async ensureCourseAccess(payment: PaymentEntity): Promise<void> {
    const course = await this.coursesRepository.findOne({
      where: { id: payment.courseId },
      relations: {
        courseModules: {
          lessons: true,
        },
      },
    });

    if (!course) {
      throw new NotFoundException("Course not found");
    }

    const lessons = [...(course.courseModules ?? [])]
      .sort((left, right) => left.position - right.position)
      .flatMap((courseModule) =>
        [...(courseModule.lessons ?? [])].sort((left, right) => left.position - right.position),
      );

    const existingEnrollment = await this.enrollmentsRepository.findOne({
      where: {
        userId: payment.userId,
        courseId: payment.courseId,
      },
    });

    const nextLesson = lessons[0]?.title ?? null;

    if (existingEnrollment) {
      existingEnrollment.status =
        existingEnrollment.progressPercent === 100
          ? EnrollmentStatus.COMPLETED
          : EnrollmentStatus.ACTIVE;
      existingEnrollment.totalLessons = lessons.length;
      existingEnrollment.nextLessonTitle =
        existingEnrollment.progressPercent === 100 ? "Курс завершен" : nextLesson;
      existingEnrollment.timeLeftLabel =
        existingEnrollment.progressPercent === 100 ? "Завершен" : "В процессе";
      existingEnrollment.lastActivityAt = new Date();
      await this.enrollmentsRepository.save(existingEnrollment);
      return;
    }

    await this.enrollmentsRepository.save(
      this.enrollmentsRepository.create({
        userId: payment.userId,
        courseId: payment.courseId,
        status: EnrollmentStatus.ACTIVE,
        progressPercent: 0,
        completedLessons: 0,
        totalLessons: lessons.length,
        nextLessonTitle: nextLesson,
        timeLeftLabel: "В процессе",
        completedAt: null,
        lastActivityAt: new Date(),
      }),
    );
  }

  private resolveAmount(course: CourseEntity, paymentType: PaymentType): number {
    return paymentType === PaymentType.SUBSCRIPTION
      ? course.subscriptionPriceUsd
      : course.priceUsd;
  }

  private toPaymentDto(
    payment: PaymentEntity,
    user?: UserEntity,
    course?: CourseEntity,
  ) {
    return {
      id: payment.id,
      userId: payment.userId,
      courseId: payment.courseId,
      courseSlug: course?.slug ?? null,
      userEmail: user?.email ?? null,
      userName: user?.displayName ?? null,
      amountUsd: payment.amountUsd,
      type: payment.type,
      status: payment.status,
      currency: payment.currency,
      transactionId: payment.transactionId,
      paymentMethodLabel: payment.paymentMethodLabel,
      accessGranted: payment.accessGranted,
      failureReason: payment.failureReason,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}

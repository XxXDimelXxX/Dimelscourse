import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";
import {
  EnrollmentEntity,
  EnrollmentStatus,
} from "../../learning/entities/enrollment.entity";
import { EnrollmentService } from "../../learning/services/enrollment.service";
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
    private readonly enrollmentService: EnrollmentService,
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
    await this.enrollmentService.grantAccess(payment.userId, payment.courseId);
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

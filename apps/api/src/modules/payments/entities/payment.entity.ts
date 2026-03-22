import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CourseEntity } from "../../catalog/entities/course.entity";
import { UserEntity } from "../../identity-access/entities/user.entity";

export enum PaymentType {
  ONE_TIME = "one-time",
  SUBSCRIPTION = "subscription",
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

@Entity("payments")
export class PaymentEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ name: "user_id", type: "uuid" })
  userId!: string;

  @Column({ name: "course_id", type: "uuid" })
  courseId!: string;

  @Column({
    type: "enum",
    enum: PaymentType,
    default: PaymentType.ONE_TIME,
  })
  type!: PaymentType;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: PaymentStatus;

  @Column({ name: "amount_usd", type: "integer", default: 0 })
  amountUsd!: number;

  @Column({ length: 3, default: "USD" })
  currency!: string;

  @Column({ length: 60, default: "demo-gateway" })
  provider!: string;

  @Column({ name: "transaction_id", length: 120, unique: true })
  transactionId!: string;

  @Column({ name: "payment_method_label", type: "varchar", nullable: true })
  paymentMethodLabel!: string | null;

  @Column({ name: "webhook_event_id", type: "varchar", nullable: true })
  webhookEventId!: string | null;

  @Column({ name: "failure_reason", type: "varchar", nullable: true })
  failureReason!: string | null;

  @Column({ name: "access_granted", default: false })
  accessGranted!: boolean;

  @Column({ name: "access_granted_at", type: "timestamp", nullable: true })
  accessGrantedAt!: Date | null;

  @ManyToOne(() => UserEntity, (user) => user.payments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user!: UserEntity;

  @ManyToOne(() => CourseEntity, (course) => course.payments, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "course_id" })
  course!: CourseEntity;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}

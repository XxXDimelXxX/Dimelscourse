import { PaymentStatus } from "../entities/payment.entity";

export class ProcessPaymentWebhookDto {
  paymentId!: string;
  status!: PaymentStatus;
  eventId?: string;
  failureReason?: string;
}

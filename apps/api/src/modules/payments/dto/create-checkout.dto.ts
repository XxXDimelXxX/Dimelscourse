import { PaymentType } from "../entities/payment.entity";

export class CreateCheckoutDto {
  userId!: string;
  courseSlug!: string;
  paymentType!: PaymentType;
  paymentMethodLabel?: string;
}

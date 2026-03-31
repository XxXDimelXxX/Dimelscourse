import { z } from "zod";
import { PaymentStatus } from "../entities/payment.entity";

export const processWebhookSchema = z.object({
  paymentId: z.string().uuid("Invalid payment ID"),
  status: z.enum([PaymentStatus.PENDING, PaymentStatus.SUCCESS, PaymentStatus.FAILED]),
  eventId: z.string().optional(),
  failureReason: z.string().max(500).optional(),
});

export type ProcessPaymentWebhookDto = z.infer<typeof processWebhookSchema>;

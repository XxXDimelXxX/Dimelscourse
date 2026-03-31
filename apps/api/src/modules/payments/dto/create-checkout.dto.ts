import { z } from "zod";
import { PaymentType } from "../entities/payment.entity";

export const createCheckoutSchema = z.object({
  courseSlug: z.string().min(1, "Course slug is required"),
  paymentType: z.enum([PaymentType.ONE_TIME, PaymentType.SUBSCRIPTION]),
  paymentMethodLabel: z.string().max(100).optional(),
});

export type CreateCheckoutDto = z.infer<typeof createCheckoutSchema>;

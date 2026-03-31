import { z } from "zod";

export const updateCourseSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  priceUsd: z.number().min(0).finite().optional(),
  subscriptionPriceUsd: z.number().min(0).finite().optional(),
  instructorName: z.string().min(1).max(255).optional(),
});

export type UpdateCourseDto = z.infer<typeof updateCourseSchema>;

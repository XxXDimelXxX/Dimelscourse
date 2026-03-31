import { z } from "zod";

export const createCourseSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  title: z.string().min(1).max(180),
  summary: z.string().min(1),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  priceUsd: z.number().int().min(0).default(0),
});

export type CreateCourseDto = z.infer<typeof createCourseSchema>;

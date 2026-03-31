import { z } from "zod";

export const updateCourseMetaSchema = z.object({
  title: z.string().min(1).max(180).optional(),
  summary: z.string().min(1).optional(),
  description: z.string().max(10000).nullable().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  priceUsd: z.number().int().min(0).optional(),
  previewImageUrl: z.string().url().nullable().optional(),
  isPublished: z.boolean().optional(),
  instructorName: z.string().min(1).max(255).optional(),
});

export type UpdateCourseMetaDto = z.infer<typeof updateCourseMetaSchema>;

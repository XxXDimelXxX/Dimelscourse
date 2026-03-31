import { z } from "zod";

export const updateLessonSchema = z.object({
  title: z.string().min(1).max(180).optional(),
  summary: z.string().max(1000).nullable().optional(),
  durationMinutes: z.number().int().min(0).optional(),
  isPreview: z.boolean().optional(),
  isLockedByDefault: z.boolean().optional(),
  isDraft: z.boolean().optional(),
  content: z.string().nullable().optional(),
});

export type UpdateLessonDto = z.infer<typeof updateLessonSchema>;

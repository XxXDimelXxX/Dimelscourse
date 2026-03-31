import { z } from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(1).max(180),
  summary: z.string().max(1000).nullable().optional(),
  durationMinutes: z.number().int().min(0).default(0),
  isPreview: z.boolean().default(false),
  isLockedByDefault: z.boolean().default(true),
  isDraft: z.boolean().default(true),
});

export type CreateLessonDto = z.infer<typeof createLessonSchema>;

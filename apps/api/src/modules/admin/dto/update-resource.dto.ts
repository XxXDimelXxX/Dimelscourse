import { z } from "zod";

export const updateResourceSchema = z.object({
  title: z.string().min(1).max(180).optional(),
  description: z.string().max(500).nullable().optional(),
  type: z.enum(["pdf", "zip", "link", "video", "image"]).optional(),
  fileUrl: z.string().url().nullable().optional(),
});

export type UpdateResourceDto = z.infer<typeof updateResourceSchema>;

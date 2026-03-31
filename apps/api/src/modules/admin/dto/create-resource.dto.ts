import { z } from "zod";

export const createResourceSchema = z.object({
  title: z.string().min(1).max(180),
  description: z.string().max(500).nullable().optional(),
  type: z.enum(["pdf", "zip", "link", "video", "image"]),
  fileUrl: z.string().url().nullable().optional(),
});

export type CreateResourceDto = z.infer<typeof createResourceSchema>;

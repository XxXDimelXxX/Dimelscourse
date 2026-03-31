import { z } from "zod";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export const requestImageUploadUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.enum(ALLOWED_IMAGE_TYPES as [string, ...string[]]),
  fileSize: z.number().int().positive().max(MAX_IMAGE_SIZE_BYTES, "Image size exceeds 10 MB limit"),
});

export type RequestImageUploadUrlDto = z.infer<typeof requestImageUploadUrlSchema>;

import { z } from "zod";

const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const MAX_FILE_SIZE_BYTES = 500 * 1024 * 1024; // 500 MB

export const requestUploadUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.enum(ALLOWED_VIDEO_TYPES as [string, ...string[]]),
  fileSize: z.number().int().positive().max(MAX_FILE_SIZE_BYTES, "File size exceeds 500 MB limit"),
});

export type RequestUploadUrlDto = z.infer<typeof requestUploadUrlSchema>;

export const confirmUploadSchema = z.object({
  videoS3Key: z.string().min(1),
  originalName: z.string().min(1),
  fileSize: z.number().int().positive(),
});

export type ConfirmUploadDto = z.infer<typeof confirmUploadSchema>;
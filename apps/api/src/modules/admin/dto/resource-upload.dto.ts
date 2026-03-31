import { z } from "zod";

const MAX_RESOURCE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export const requestResourceUploadUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  fileSize: z.number().int().positive().max(MAX_RESOURCE_SIZE_BYTES, "File size exceeds 50 MB limit"),
});

export type RequestResourceUploadUrlDto = z.infer<typeof requestResourceUploadUrlSchema>;

export const confirmResourceUploadSchema = z.object({
  resourceId: z.string().uuid(),
  s3Key: z.string().min(1),
  originalName: z.string().min(1),
  fileSize: z.number().int().positive(),
});

export type ConfirmResourceUploadDto = z.infer<typeof confirmResourceUploadSchema>;

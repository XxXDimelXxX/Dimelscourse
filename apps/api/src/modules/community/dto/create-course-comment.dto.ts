import { z } from "zod";

export const createCourseCommentSchema = z.object({
  body: z
    .string()
    .min(1, "Comment body is required")
    .max(5000, "Comment is too long"),
});

export type CreateCourseCommentDto = z.infer<typeof createCourseCommentSchema>;

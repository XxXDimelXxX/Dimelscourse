import { z } from "zod";

export const toggleAccessSchema = z.object({
  grant: z.boolean(),
  courseSlug: z.string().min(1).optional(),
});

export type ToggleAccessDto = z.infer<typeof toggleAccessSchema>;

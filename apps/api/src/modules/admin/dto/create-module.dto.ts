import { z } from "zod";

export const createModuleSchema = z.object({
  title: z.string().min(1).max(180),
});

export type CreateModuleDto = z.infer<typeof createModuleSchema>;

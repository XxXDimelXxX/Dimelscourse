import { z } from "zod";

export const updateModuleSchema = z.object({
  title: z.string().min(1).max(180),
});

export type UpdateModuleDto = z.infer<typeof updateModuleSchema>;

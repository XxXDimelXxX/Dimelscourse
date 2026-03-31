import { z } from "zod";

export const reorderSchema = z.object({
  direction: z.enum(["up", "down"]),
});

export type ReorderDto = z.infer<typeof reorderSchema>;

import { z } from "zod";

export const loginLocalSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8),
});

export type LoginLocalDto = z.infer<typeof loginLocalSchema>;

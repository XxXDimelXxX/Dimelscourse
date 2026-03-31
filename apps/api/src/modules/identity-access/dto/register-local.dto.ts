import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email()
  .transform((value) => value.toLowerCase());

export const registerLocalSchema = z.object({
  email: emailSchema,
  displayName: z.string().trim().min(1).max(120),
  password: z.string().min(8),
});

export type RegisterLocalDto = z.infer<typeof registerLocalSchema>;

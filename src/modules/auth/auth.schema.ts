import z from "zod";

export const createUserDTO = z.object({
  email: z.email("Invalid email address").trim(),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be at most 16 characters long")
    .trim(),
  phone: z.string({ error: "Phone is required" }).trim(),
  name: z.string({ error: "Full name is required" }).trim(),
});

export const loginUserDTO = z.object({
  email: z.email("Invalid email address"),
  password: z.string(),
});

export const verifyEmailDTO = z.object({
  email: z.email("Invalid email address"),
  code: z.string(),
});

export type CreateUserDTO = z.infer<typeof createUserDTO>;
export type LoginUserDTO = z.infer<typeof loginUserDTO>;
export type VerifyEmailDTO = z.infer<typeof verifyEmailDTO>;

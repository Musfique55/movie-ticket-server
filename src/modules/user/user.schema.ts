import { Role } from "@/generated/prisma/enums";
import z from "zod";

export const createUserDTO = z.object({
  email: z.string({ error: "Email is required" }).email("Email is not valid"),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters long")
    .max(16, "Password must be at most 16 characters long"),
  phone: z.string({ error: "Phone is required" }),
  role: z.nativeEnum(Role).default(Role.USER),
  name: z.string({ error: "Full name is required" }),
});

export type CreateUserDTO = z.infer<typeof createUserDTO>;

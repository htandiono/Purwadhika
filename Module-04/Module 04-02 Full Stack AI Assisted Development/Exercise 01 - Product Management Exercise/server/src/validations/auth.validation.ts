import { z } from "zod";

export const registerBodySchema = z.object({
  email: z.string().email("Enter a valid email address").toLowerCase(),
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export const loginBodySchema = z.object({
  email: z.string().email("Enter a valid email address").toLowerCase(),
  password: z.string().min(1, "Password is required")
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
export type LoginInput = z.infer<typeof loginBodySchema>;

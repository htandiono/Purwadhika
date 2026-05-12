import { z } from "zod";

export const userSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().min(1, "Email is required").email("Email must be valid")
});

export type UserFormData = z.infer<typeof userSchema>;

import { z } from "zod";

// Strong password regex: 8+ chars, 1 upper, 1 lower, 1 number, 1 special
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const signupSchema = z.object({
  name: z
    .string()
    .regex(/^[A-Za-z\s]+$/, "Name must contain only alphabets and spaces"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .regex(
      passwordRegex,
      "Password must be at least 8 characters with 1 uppercase, 1 lowercase, 1 number, and 1 special character",
    ),
  role: z.enum(["author", "reader"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

// Export types
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

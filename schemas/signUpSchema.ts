import { z } from "zod";

export const signUpSchema = z
  .object({
    first_name: z.string().min(2, "First Name must be at least 2 characters"),
    last_name: z.string().min(2, "Last Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

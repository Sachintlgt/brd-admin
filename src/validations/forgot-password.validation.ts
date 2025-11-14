// src/validations/forgot-password.validation.ts
import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

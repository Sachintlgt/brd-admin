// src/validations/reset-password.validation.ts
import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const resetPasswordSchema = z
  .object({
    token: z
      .string()
      .nonempty({ message: 'Reset token is required' })
      .min(10, { message: 'Invalid token format' }),
    newPassword: z
      .string()
      .nonempty({ message: 'New password is required' })
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(passwordRegex, {
        message: 'Password must contain uppercase, lowercase, number and special character',
      }),
    confirmPassword: z.string().nonempty({ message: 'Please confirm your password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match. Please try again.',
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

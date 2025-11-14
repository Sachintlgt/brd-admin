// src/validations/auth.validation.ts
import { z } from 'zod';

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email format' }),

  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(1, { message: 'Password cannot be empty' }),

  // Make role completely optional in the schema
  role: z.enum(['BUYER', 'CHANNEL_PARTNER', 'STAFF', 'ADMIN']).optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

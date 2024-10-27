import { z } from 'zod';

import { InferSchema } from '@/types';

export const resetPasswordSchema = z.object({
  email: z.string().email().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  sendMail: z.boolean().optional(),
});

export type ResetPasswordForm = InferSchema<typeof resetPasswordSchema>;

export const resetPasswordDefaultValue: ResetPasswordForm = {
  email: '',
  password: '',
  sendMail: false,
};

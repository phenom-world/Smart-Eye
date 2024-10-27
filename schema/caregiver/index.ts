import { z } from 'zod';

import { InferSchema } from '@/types';

export const caregiverSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().min(1, 'Email field is required'),
  phone: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  sssopId: z.string().optional(),
  gender: z.string().optional(),
  dob: z.date().optional(),
  sendMail: z.boolean().optional(),
});

export type CaregiverForm = InferSchema<typeof caregiverSchema>;

export const caregiverDefaultValue: CaregiverForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  zip: '',
  country: '',
  state: '',
  city: '',
  address: '',
  sssopId: '',
  gender: undefined,
  dob: undefined,
  sendMail: false,
};

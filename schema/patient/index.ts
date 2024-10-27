import { z } from 'zod';

import { InferSchema } from '@/types';

export const patientSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().min(1, 'Email field is required'),
  zip: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
  dob: z.date().optional(),
  gender: z.string().optional(),
  apartmentNumber: z.string().optional(),
  medicaidNumber: z.string().optional(),
  phone: z.string().optional(),
  ssnNumber: z.string().optional(),
  race: z.string().optional(),
});

export type PatientForm = InferSchema<typeof patientSchema>;

export const patientDefaultValue: PatientForm = {
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  zip: '',
  country: '',
  state: '',
  city: '',
  address: '',
  dob: undefined,
  gender: undefined,
  apartmentNumber: '',
  medicaidNumber: '',
  phone: '',
  ssnNumber: '',
  race: '',
};

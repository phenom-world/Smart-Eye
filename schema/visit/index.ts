import { z } from 'zod';

import { InferSchema } from '@/types';

export const visitSchema = z
  .object({
    patientId: z.string().min(1, 'Patient is required'),
    caregiverId: z.string().min(1, 'Caregiver is required'),
    visitDate: z.date().min(new Date(), 'Visit date must be in the future'),
    startTime: z.string().min(1, 'Time in is required'),
    endTime: z.string().min(1, 'Time out is required'),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    isRecurring: z.boolean().optional(),
    frequency: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const startTime = new Date(`01/01/2024 ${data.startTime}`);
      const endTime = new Date(`01/01/2024 ${data.endTime}`);
      if (startTime >= endTime) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Time In must be less than Time Out',
          path: ['endTime'],
        });
      }
    }

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start Date must be less than End Date',
        path: ['endDate'],
      });
    }

    if (data.isRecurring) {
      if (!data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Start Date required for recurring visits',
          path: ['startDate'],
        });
      }
      if (!data.endDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'End Date required for recurring visits',
          path: ['endDate'],
        });
      }
    }
  });

export type VisitForm = InferSchema<typeof visitSchema>;

export const visitDefaultValue: VisitForm = {
  patientId: '',
  caregiverId: '',
  startTime: '',
  endTime: '',
  isRecurring: false,
  frequency: '',
  visitDate: new Date(),
  startDate: undefined,
  endDate: undefined,
};

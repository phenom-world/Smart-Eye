import { NextResponse } from 'next/server';
import { z } from 'zod';

import { loginFormSchema } from '@/schema/auth/login';
import { ValidateParseResponse } from '@/types';

import { CustomRequest, validate } from '../../lib';
import { NextFunction } from '../../middlewares/handler';

const CaregiverLoginSchema = loginFormSchema.extend({
  companyId: z.number().min(1, { message: 'Company ID is required' }),
});

export const validateCaregiverLogin = async (req: CustomRequest, _res: NextResponse, next: NextFunction): Promise<NextResponse | void> => {
  const data = await req.clone().json();
  const response = CaregiverLoginSchema.safeParse(data) as ValidateParseResponse;
  return validate(response, next);
};

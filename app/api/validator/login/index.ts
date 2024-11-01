import { NextResponse } from 'next/server';
import { z } from 'zod';

import { loginFormSchema } from '@/schema/auth/login';
import { ValidateParseResponse } from '@/types';

import { CustomRequest, validate } from '../../lib';
import { NextFunction } from '../../middlewares/handler';

const LoginSchema = loginFormSchema
  .extend({
    isAdmin: z.boolean().optional(),
    companyId: z.number().optional(),
  })
  .refine((data) => data.isAdmin || !!data.companyId, { message: 'Company ID is required', path: ['companyId'] });

export const loginValidator = async (req: CustomRequest, _res: NextResponse, next: NextFunction): Promise<NextResponse | void> => {
  const data = await req.clone().json();
  const response = LoginSchema.safeParse(data) as ValidateParseResponse;
  return validate(response, next);
};

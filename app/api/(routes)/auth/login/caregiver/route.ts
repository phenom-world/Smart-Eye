import bcrypt from 'bcryptjs';

import { validateCaregiverLogin } from '@/app/api/validator';
import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, authenticateUserWithProvider, CustomRequest, ErrorResponse } from '../../../../lib';
import { handler } from '../../../../middlewares';

const loginUser = asyncWrapper(async (req: CustomRequest) => {
  const { email, password, companyId } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email: email?.trim().toLowerCase(), UserProvider: { some: { provider: { id: companyId } } } },
    select: {
      UserProvider: { where: { provider: { id: companyId } }, include: { provider: { include: { logo: true } } } },
      cuid: true,
      id: true,
      email: true,
      password: true,
      firstName: true,
      lastName: true,
      profilePhoto: true,
      status: true,
    },
  });

  if (!user) {
    return ErrorResponse('invalid login credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password as string);
  if (!isPasswordValid) {
    return ErrorResponse('invalid login credentials', 401);
  }

  if (user.status !== 'ACTIVE') {
    return ErrorResponse('user is not active, please contact your administrator', 401);
  }

  const { UserProvider, ...rest } = user;

  const resp = authenticateUserWithProvider({ ...user, providerId: UserProvider[0]?.providerId });
  const responseCombined = {
    ...rest,
    password: undefined,
    provider: UserProvider[0]?.provider,
    providerId: UserProvider[0]?.providerId,
    accessToken: resp?.token,
    refreshToken: resp?.refreshToken,
  };
  return ApiResponse(responseCombined);
});

export const POST = handler(validateCaregiverLogin, loginUser);

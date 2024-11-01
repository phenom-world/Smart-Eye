import bcrypt from 'bcryptjs';

import { loginValidator } from '@/app/api/validator';
import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, authenticateUserWithProvider, CustomRequest, ErrorResponse } from '../../../lib';
import { handler } from '../../../middlewares';

const loginUser = asyncWrapper(async (req: CustomRequest) => {
  const { email, password, companyId } = await req.json();
  let user;
  if (companyId) {
    user = await prisma.user.findUnique({
      where: { email_providerId: { email: email?.trim().toLowerCase(), providerId: companyId } },
      select: {
        provider: { include: { logo: true } },
        providerId: true,
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
  } else {
    user = await prisma.user.findFirst({
      where: { email: email?.trim().toLowerCase() },
      select: {
        provider: { include: { logo: true } },
        providerId: true,
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
  }

  if (!user) {
    return ErrorResponse('invalid username and password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password as string);
  if (!isPasswordValid) {
    return ErrorResponse('invalid username and password', 401);
  }

  if (user.status !== 'ACTIVE') {
    return ErrorResponse('user is not active, please contact your administrator', 401);
  }

  const resp = authenticateUserWithProvider({ id: user.id, cuid: user.cuid, providerId: user?.providerId });
  const responseCombined = {
    ...user,
    password: undefined,
    accessToken: resp?.token,
    refreshToken: resp?.refreshToken,
  };
  return ApiResponse(responseCombined);
});

export const POST = handler(loginValidator, loginUser);

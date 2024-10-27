import bcrypt from 'bcryptjs';

import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, authenticateUser, authenticateUserWithProvider, CustomRequest, ErrorResponse } from '../../../lib';
import { handler } from '../../../middlewares';

const loginUser = asyncWrapper(async (req: CustomRequest) => {
  const { email, password } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email: email?.trim().toLowerCase() },
    select: {
      UserProvider: { include: { provider: { include: { logo: true } } } },
      uuid: true,
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
    return ErrorResponse('invalid username and password', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password as string);
  if (!isPasswordValid) {
    return ErrorResponse('invalid username and password', 401);
  }

  if (user.status !== 'ACTIVE') {
    return ErrorResponse('user is not active, please contact your administrator', 401);
  }

  const { UserProvider, ...rest } = user;
  const providers = await Promise.all(UserProvider.map(async (item) => item.provider));

  if (UserProvider.length > 1) {
    // generate token for user with multiple providers
    const token = authenticateUser(user?.id, user?.uuid);
    return ApiResponse({ providers, accessToken: token });
  } else {
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
  }
});

export const POST = handler(loginUser);

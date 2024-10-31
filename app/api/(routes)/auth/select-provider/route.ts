import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, authenticateUserWithProvider, CustomRequest, ErrorResponse } from '../../../lib';
import { authorizeProvider, handler } from '../../../middlewares';

const switchProvider = asyncWrapper(async (req: CustomRequest) => {
  const user = req.user;
  const allProviders = await prisma.userProvider.findMany({
    where: { userId: user.cuid },
    select: { provider: { include: { logo: true } }, providerId: true },
  });
  const resp = authenticateUserWithProvider({ ...user, providerId: user.UserProvider[0]?.providerId });
  if (user.status !== 'ACTIVE') {
    return ErrorResponse('user is not active, please contact your administrator', 401);
  }
  const providers = await Promise.all(allProviders.map(async (item) => item.provider));

  const responseCombined = {
    ...user,
    providers,
    provider: user.UserProvider[0]?.provider,
    providerId: user.UserProvider[0]?.providerId,
    password: undefined,
    accessToken: resp?.token,
    refreshToken: resp?.refreshToken,
  };
  return ApiResponse(responseCombined);
});

export const POST = handler(authorizeProvider, switchProvider);

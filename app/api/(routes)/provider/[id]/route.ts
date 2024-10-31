import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest } from '../../../lib';
import { authorizeUser, handler } from '../../../middlewares';

type GetProviderById = { params: { id: string } };

const fetchProviderById = asyncWrapper(async (_req: CustomRequest, { params }: GetProviderById) => {
  const provider = await prisma.provider.findUnique({ where: { cuid: params.id }, include: { logo: true } });
  return ApiResponse(provider);
});

export const GET = handler(authorizeUser, fetchProviderById);

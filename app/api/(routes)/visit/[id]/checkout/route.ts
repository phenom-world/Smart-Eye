import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest } from '../../../../lib';
import { authorizeMutateProvider, authorizeRoles, authorizeUser, handler } from '../../../../middlewares';

const checkoutVisit = asyncWrapper(async (_req: CustomRequest, { params }: { params: { id: string } }) => {
  await prisma.visit.update({
    where: { cuid: params.id },
    data: {
      checkoutAt: new Date(),
      status: 'COMPLETED',
    },
  });
  return ApiResponse(null, 'Caregiver checked out successfully');
});

const POST = handler(authorizeUser, authorizeRoles('caregiver'), authorizeMutateProvider('visit'), checkoutVisit);

export { POST };

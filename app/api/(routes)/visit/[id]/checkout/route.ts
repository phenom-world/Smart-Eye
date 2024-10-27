import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest } from '../../../../lib';
import { authorizeUser, handler } from '../../../../middlewares';
import { authorizeRoles } from '../../../../middlewares/auth';

const checkoutVisit = asyncWrapper(async (_req: CustomRequest, { params }: { params: { id: string } }) => {
  await prisma.visit.update({
    where: { uuid: params.id },
    data: {
      checkoutAt: new Date(),
      status: 'COMPLETED',
    },
  });
  return ApiResponse(null, 'Caregiver checked out successfully');
});

const POST = handler(authorizeUser, authorizeRoles('caregiver'), checkoutVisit);

export { POST };

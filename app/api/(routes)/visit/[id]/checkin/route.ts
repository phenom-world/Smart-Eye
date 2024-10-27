import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest } from '../../../../lib';
import { authorizeUser, handler } from '../../../../middlewares';
import { authorizeRoles } from '../../../../middlewares/auth';

const checkinVisit = asyncWrapper(async (req: CustomRequest, { params }: { params: { id: string } }) => {
  const { latitude, longitude } = await req.json();

  await prisma.visit.update({
    where: { uuid: params.id },
    data: {
      checkinAt: new Date(),
      latitude,
      longitude,
      status: 'IN_PROGRESS',
    },
  });
  return ApiResponse(null, 'Caregiver checked in successfully');
});

const POST = handler(authorizeUser, authorizeRoles('caregiver'), checkinVisit);

export { POST };

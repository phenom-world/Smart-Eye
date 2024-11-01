import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, calculateDistance, CustomRequest, ErrorResponse } from '../../../../lib';
import { authorizeUser, handler } from '../../../../middlewares';
import { authorizeMutateProvider, authorizeRoles } from '../../../../middlewares/auth';

const checkinVisit = asyncWrapper(async (req: CustomRequest, { params }: { params: { id: string } }) => {
  const { latitude, longitude } = await req.json();
  const visit = await prisma.visit.findUnique({
    where: { cuid: params.id },
    include: { patient: { include: { location: true } } },
  });

  if (!visit?.patient?.address) {
    return ErrorResponse('Patient address is required');
  }

  const distance = calculateDistance(latitude, longitude, visit?.patient?.location?.latitude ?? 0, visit?.patient?.location?.longitude ?? 0);

  // Check if distance is greater than 0.5 kilometers (500 meters)
  if (distance > 0.5) {
    return ErrorResponse("You are too far from the patient's location to check in");
  }

  await prisma.visit.update({
    where: { cuid: params.id },
    data: {
      checkinAt: new Date(),
      latitude,
      longitude,
      status: 'IN_PROGRESS',
    },
  });

  return ApiResponse(null, 'Caregiver checked in successfully');
});

const POST = handler(authorizeUser, authorizeRoles('caregiver'), authorizeMutateProvider('visit'), checkinVisit);

export { POST };

import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest } from '../../../../lib';
import { authorizeUser, handler } from '../../../../middlewares';
import { authorizeRoles } from '../../../../middlewares/auth';

const signVisit = asyncWrapper(async (req: CustomRequest, { params }: { params: { id: string } }) => {
  const { patientSignatureId, caregiverSignatureId } = await req.json();
  await prisma.visit.update({
    where: { uuid: params.id },
    data: {
      patientSignature: patientSignatureId && { create: { mediaId: patientSignatureId } },
      caregiverSignature: caregiverSignatureId && { create: { mediaId: caregiverSignatureId } },
      checkinAt: new Date(),
      status: 'IN_PROGRESS',
    },
  });
  return ApiResponse(null, 'Visit checked in successfully');
});

const POST = handler(authorizeUser, authorizeRoles('caregiver'), signVisit);

export { POST };

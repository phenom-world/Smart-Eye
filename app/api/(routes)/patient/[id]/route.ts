import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest } from '../../../lib';
import { authorizeUser, handler } from '../../../middlewares';

type ParamProps = { params: { id: string } };

const fetchPatientById = async (req: CustomRequest, { params: { id } }: ParamProps) => {
  const patient = await prisma.patient.findUnique({
    where: { cuid: id as string, providerId: req.user?.providerId },
    include: {
      PatientAdmission: { include: { admittedBy: true, dischargedBy: true }, orderBy: { createdAt: 'desc' } },
      Visit: { include: { caregiver: true }, orderBy: { visitDate: 'desc' } },
      profilePhoto: true,
    },
  });
  return ApiResponse(patient);
};

const GET = handler(authorizeUser, asyncWrapper(fetchPatientById));

export { GET };

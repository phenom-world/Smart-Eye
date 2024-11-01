import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest } from '../../../lib';
import { authorizeUser, handler } from '../../../middlewares';
import { authorizeGetProvider, authorizeRoles } from '../../../middlewares/auth';
type ParamProps = { params: { id: string } };

const fetchPatientById = async (req: CustomRequest, { params: { id } }: ParamProps) => {
  const patient = await prisma.patient.findUnique({
    where: { cuid: id as string },
    include: {
      PatientAdmission: { include: { admittedBy: true, dischargedBy: true }, orderBy: { createdAt: 'desc' } },
      Visit: { include: { caregiver: true }, orderBy: { visitDate: 'desc' } },
      profilePhoto: true,
    },
  });
  return ApiResponse(patient);
};

const GET = handler(authorizeUser, authorizeRoles('admin'), authorizeGetProvider('patient'), asyncWrapper(fetchPatientById));

export { GET };

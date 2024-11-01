import { AdmissionStatus } from '@prisma/client';

import { authorizeMutateProvider, authorizeRoles } from '@/app/api/middlewares/auth';
import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest, ErrorResponse } from '../../../../lib';
import { authorizeUser, handler } from '../../../../middlewares';

type ParamProps = { params: { id: string } };

const admitOrDischargePatient = async (req: CustomRequest, { params: { id } }: ParamProps) => {
  const data = await req.json();
  let admission;
  if (data.status?.toLowerCase() === 'discharged') {
    admission = { dischargedBy: { connect: { cuid: req.user.cuid } }, reason: data?.reason };
  } else if (data.status?.toLowerCase() === 'active') {
    admission = { admittedBy: { connect: { cuid: req.user.cuid } } };
  } else {
    return ErrorResponse('invalid admission status provided', 401);
  }

  await prisma.patientAdmission.create({
    data: {
      patient: { connect: { cuid: id } },
      status: data.status?.toUpperCase() as AdmissionStatus,
      ...admission,
    },
  });

  return ApiResponse(null, `Patient ${data.status} successfully`);
};

const PUT = handler(authorizeUser, authorizeRoles('admin'), authorizeMutateProvider('patient'), asyncWrapper(admitOrDischargePatient));
export { PUT };

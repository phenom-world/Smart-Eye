import { AdmissionStatus } from '@prisma/client';

import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest, ErrorResponse } from '../../../../lib';
import { authorizeUser, handler } from '../../../../middlewares';

type ParamProps = { params: { id: string } };

const admitOrDischargePatient = async (req: CustomRequest, { params: { id } }: ParamProps) => {
  const data = await req.json();
  let admission;
  if (data.status?.toLowerCase() === 'discharged') {
    admission = { dischargedBy: { connect: { uuid: req.user.uuid } }, reason: data?.reason };
  } else if (data.status?.toLowerCase() === 'active') {
    admission = { admittedBy: { connect: { uuid: req.user.uuid } } };
  } else {
    return ErrorResponse('invalid admission status provided', 401);
  }

  await prisma.patientAdmission.create({
    data: {
      patient: { connect: { uuid: id } },
      status: data.status?.toUpperCase() as AdmissionStatus,
      ...admission,
    },
  });

  return ApiResponse(null, `Patient ${data.status} successfully`);
};

const PUT = handler(authorizeUser, asyncWrapper(admitOrDischargePatient));
export { PUT };

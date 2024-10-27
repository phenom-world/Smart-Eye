import { isEmpty } from 'lodash';

import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest, ErrorResponse, getQuery } from '../../lib';
import { authorizeUser, handler } from '../../middlewares';
import { getPatients } from './helper';

const fetchPatients = async (req: CustomRequest) => {
  const { status, filter } = getQuery(req);
  const authUser = req.user;
  const patients = await getPatients({ providerId: authUser?.providerId as string, status, filter });
  return ApiResponse(patients);
};

const createPatient = async (req: CustomRequest) => {
  const data = await req.json();
  if (!isEmpty(data)) {
    const createdPatient = await prisma.patient.create({
      data: {
        ...data,
        provider: { connect: { uuid: req.user?.providerId } },
      },
    });
    await prisma.patientAdmission.create({ data: { patientId: createdPatient.uuid, status: 'ACTIVE' } });
    return ApiResponse(createdPatient, 'Patient created successfully');
  } else {
    return ErrorResponse('One or more patient information is required', 400);
  }
};

const updatePatient = async (req: CustomRequest) => {
  const data = await req.json();
  const { id, mediaId, ...rest } = data;
  const user = req.user;
  const updatedPatient = await prisma.patient.update({
    where: { uuid: id, providerId: user?.providerId },
    data: { ...rest, profilePhoto: mediaId && { create: { mediaId: mediaId as string } } },
  });
  return ApiResponse(updatedPatient, 'Patient updated successfully');
};

const deletePatients = asyncWrapper(async (req: CustomRequest) => {
  const { ids, status } = await req.json();
  await prisma.patient.updateMany({
    where: { uuid: { in: ids || [] }, providerId: req.user?.providerId as string },
    data: { active: status === 'archived' ? false : true, archivedAt: status === 'archived' ? new Date() : null },
  });
  return ApiResponse(null, `User(s) ${status === 'archived' ? 'archived' : 'activated'} successfully`);
});

const GET = handler(authorizeUser, asyncWrapper(fetchPatients));
const POST = handler(authorizeUser, asyncWrapper(createPatient));
const PUT = handler(authorizeUser, asyncWrapper(updatePatient));
const DELETE = handler(authorizeUser, asyncWrapper(deletePatients));

export { DELETE, GET, POST, PUT };

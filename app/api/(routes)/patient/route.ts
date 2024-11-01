import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest, ErrorResponse, geocode, getQuery } from '../../lib';
import { authorizeRoles, authorizeUser, handler } from '../../middlewares';
import { authorizeMutateProvider } from '../../middlewares/auth';
import { getPatients } from './helper';

const fetchPatients = async (req: CustomRequest) => {
  const { status, filter } = getQuery(req);
  const authUser = req.user;
  const patients = await getPatients({ providerId: authUser?.providerId, status, filter });
  return ApiResponse(patients);
};

const createPatient = async (req: CustomRequest) => {
  const data = await req.json();
  let res;

  if (data?.address) {
    res = await geocode({ address: data.address, country: data.country });
    if (!res) {
      return ErrorResponse('Could not geocode patient address due to an invalid or missing address');
    }
  }

  const createdPatient = await prisma.patient.create({
    data: {
      ...data,
      provider: { connect: { id: req.user?.providerId } },
      location: res && { create: { latitude: res?.lat, longitude: res?.lng } },
    },
  });
  await prisma.patientAdmission.create({ data: { patientId: createdPatient.cuid, status: 'ACTIVE' } });
  return ApiResponse(createdPatient, 'Patient created successfully');
};

const updatePatient = async (req: CustomRequest) => {
  const data = await req.json();
  const { id, mediaId, ...rest } = data;
  let res;
  if (data?.address) {
    res = await geocode({ address: data.address, country: data.country });
    if (!res) {
      return ErrorResponse('Could not geocode patient address due to an invalid or missing address');
    }
  }

  const updatedPatient = await prisma.patient.update({
    where: { cuid: id },
    data: {
      ...rest,
      profilePhoto: mediaId && { create: { mediaId: mediaId as string } },
      location: res && { create: { latitude: res?.lat, longitude: res?.lng } },
    },
  });
  return ApiResponse(updatedPatient, 'Patient updated successfully');
};

const deletePatients = asyncWrapper(async (req: CustomRequest) => {
  const { ids, status } = await req.json();
  await prisma.patient.updateMany({
    where: { cuid: { in: ids || [] }, providerId: req.user?.providerId },
    data: { active: status === 'archived' ? false : true, archivedAt: status === 'archived' ? new Date() : null },
  });
  return ApiResponse(null, `User(s) ${status === 'archived' ? 'archived' : 'activated'} successfully`);
});

const GET = handler(authorizeUser, authorizeRoles('admin'), asyncWrapper(fetchPatients));
const POST = handler(authorizeUser, authorizeRoles('admin'), asyncWrapper(createPatient));
const PUT = handler(authorizeUser, authorizeRoles('admin'), authorizeMutateProvider('patient'), asyncWrapper(updatePatient));
const DELETE = handler(authorizeUser, authorizeRoles('admin'), asyncWrapper(deletePatients));

export { DELETE, GET, POST, PUT };

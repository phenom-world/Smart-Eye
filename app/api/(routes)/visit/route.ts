import prisma from '@/prisma';

import { ApiResponse, asyncForEach, asyncWrapper, CustomRequest, getQuery } from '../../lib';
import { authorizeUser, handler } from '../../middlewares';
import { authorizeRoles } from '../../middlewares/auth';
import { getVisitFilter } from './helper';

const fetchVisits = asyncWrapper(async (req: CustomRequest) => {
  const { status, date } = getQuery(req);
  const filter = getVisitFilter(status, date);

  const authUser = req.user;
  const visits = await prisma.visit.findMany({
    where: { ...filter, providerId: authUser?.providerId },
    include: { caregiver: true, patient: true },
    orderBy: { startTime: 'asc' },
  });
  return ApiResponse(visits);
});

const scheduleVisit = asyncWrapper(async (req: CustomRequest) => {
  const { dates, patientId, caregiverId, startTime, endTime } = await req.json();
  await asyncForEach(dates, async (date: Date) => {
    const startDate = new Date(date);
    const endDate = new Date(date);
    startDate.setHours(Number(startTime.split(':')[0]), Number(startTime.split(':')[1]));
    endDate.setHours(Number(endTime.split(':')[0]), Number(endTime.split(':')[1]));
    await prisma.visit.create({
      data: {
        visitDate: date,
        startTime: startDate,
        endTime: endDate,
        patient: { connect: { cuid: patientId } },
        caregiver: { connect: { cuid: caregiverId } },
        provider: { connect: { id: req.user?.providerId } },
      },
    });
  });

  return ApiResponse(null, 'Patient visit scheduled successfully');
});

const POST = handler(authorizeUser, authorizeRoles('admin'), scheduleVisit);
const GET = handler(authorizeUser, fetchVisits);

export { GET, POST };

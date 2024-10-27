import prisma from '@/prisma';

import { ApiResponse, asyncWrapper, CustomRequest, getQuery, ParamProps } from '../../../../lib';
import { authorizeUser, handler } from '../../../../middlewares';
import { authorizeRoles } from '../../../../middlewares/auth';
import { getVisitFilter } from '../../../visit/helper';

const fetchVisits = asyncWrapper(async (req: CustomRequest, { params: { id } }: ParamProps) => {
  const { status } = getQuery(req);
  const filter = getVisitFilter(status);

  const authUser = req.user;
  const visits = await prisma.visit.findMany({
    where: {
      ...filter,
      patientId: id,
      providerId: authUser?.providerId,
    },
    include: {
      caregiver: true,
      patient: true,
    },
  });
  return ApiResponse(visits);
});

const GET = handler(authorizeUser, authorizeRoles('admin'), fetchVisits);

export { GET };

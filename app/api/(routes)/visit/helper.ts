import { VisitStatus } from '@prisma/client';

import { dateFilter } from '../../lib';

const getVisitFilter = (status: string, date?: string) => {
  if (status?.toLowerCase() === 'all') {
    return {};
  } else if (status?.toLowerCase() === 'upcoming') {
    return { startTime: { gte: new Date() }, status: null };
  } else if (status?.toLowerCase() === 'missed') {
    return { endTime: { lte: new Date() } };
  } else if (status?.toLowerCase() === 'today') {
    return { startTime: dateFilter(new Date().toISOString()) };
  } else if (status) {
    return { status: status?.toUpperCase() as VisitStatus };
  } else if (date) {
    return { startTime: dateFilter(date) };
  } else {
    return {};
  }
};

export { getVisitFilter };

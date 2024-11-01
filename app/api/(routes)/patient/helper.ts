import { AdmissionStatus } from '@prisma/client';

import prisma from '@/prisma';

export async function getPatients({ providerId, status, filter }: { providerId: number; status?: string; filter: string }) {
  const patientFilter = filter === 'all' ? {} : { active: filter !== 'archived' };
  let patients;
  patients = await prisma.patient.findMany({
    where: {
      providerId,
      ...patientFilter,
      PatientAdmission: { some: { status: status?.toUpperCase() as AdmissionStatus } },
    },
    include: {
      PatientAdmission: { orderBy: { createdAt: 'desc' }, take: 1, include: { patient: true, admittedBy: true, dischargedBy: true } },
    },
  });

  if (status) {
    patients = patients?.filter((pat) => {
      const patient = pat?.PatientAdmission[0];
      return patient?.status === status?.toUpperCase();
    });
  }
  return patients;
}

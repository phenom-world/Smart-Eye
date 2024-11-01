import { VisitStatus } from '@prisma/client';

import { useMutation } from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';
import { getQueryString, postRequest } from '@/lib';
import { MutatePayload, VisitResponse } from '@/types';

type CreateVisitPayload = {
  dates: string[];
  patientId: string;
  caregiverId: string;
  startTime: string;
  endTime: string;
};

export const useGetVisits = ({ status }: { status?: VisitStatus }) => {
  const query = getQueryString({ status });
  return useQuery<VisitResponse[]>(`/api/visit?${query}`);
};
export const useGetPatientVisits = ({ status, id }: { status?: VisitStatus; id: string }) => {
  const query = getQueryString({ status });
  return useQuery<VisitResponse[]>(`/api/patient/${id}/visit?${query}`, !!id);
};

export const useCreateVisit = (prop?: MutatePayload) => {
  return useMutation<CreateVisitPayload, VisitResponse>('/api/visit', postRequest, prop);
};

import { AdmissionStatus } from '@prisma/client';

import { useMutation } from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';
import { deleteRequest, getQueryString, postRequest, putRequest } from '@/lib';
import { PatientForm } from '@/schema';
import { MutatePayload, PatientResponse } from '@/types';

type ArchivePayload = {
  ids: string[];
  status: string;
};

export const useGetPatients = ({ status, filter }: { filter?: string; status?: AdmissionStatus }) => {
  const query = getQueryString({ filter, status });
  return useQuery<PatientResponse[]>(`/api/patient?${query}`);
};

export const useGetPatient = ({ id }: { id: string }) => {
  return useQuery<PatientResponse>(`/api/patient/${id}`, !!id);
};

export const useCreatePatient = (prop?: MutatePayload) => {
  return useMutation<PatientForm, PatientResponse>('/api/patient', postRequest, prop);
};

export const useUpdatePatient = (prop?: MutatePayload) => {
  return useMutation<Partial<PatientForm> & { id: string; mediaId?: string }, PatientResponse>('/api/patient', putRequest, prop);
};

export const useArchivePatient = (prop?: MutatePayload) => {
  return useMutation<ArchivePayload, void>('/api/patient', deleteRequest, prop);
};

export const useDischargePatient = (id: string, prop?: MutatePayload) => {
  return useMutation<{ status: string; reason: string }, void>(`/api/patient/${id}/admission`, putRequest, prop);
};

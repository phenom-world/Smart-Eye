import { UserStatus } from '@prisma/client';

import { useMutation } from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';
import { deleteRequest, getQueryString, postRequest, putRequest } from '@/lib';
import { CaregiverForm } from '@/schema';
import { ResetPasswordForm } from '@/schema/caregiver/reset-password';
import { MutatePayload, UserResponse } from '@/types';

type updateStatusPayload = {
  ids: string[];
  status: UserStatus;
};

export const useGetUsers = ({ status, role }: { status: string; role: string }) => {
  const query = getQueryString({ status, role });
  return useQuery<UserResponse[]>(`/api/user?${query}`);
};

export const useCreateUser = (prop?: MutatePayload) => {
  return useMutation<CaregiverForm & { role: string }, UserResponse>('/api/user', postRequest, prop);
};
export const useUpdateUser = (prop?: MutatePayload) => {
  return useMutation<CaregiverForm & { id: string }, UserResponse>('/api/user', putRequest, prop);
};

export const useResetPassword = (prop?: MutatePayload) => {
  return useMutation<ResetPasswordForm, void>('/api/user/reset-password', postRequest, prop);
};

export const useUpdateUserStatus = (prop?: MutatePayload) => {
  return useMutation<updateStatusPayload, void>('/api/user', deleteRequest, prop);
};

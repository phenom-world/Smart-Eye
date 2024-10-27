import { Provider } from '@prisma/client';

import { useMutation } from '@/hooks/useMutation';
import useQuery from '@/hooks/useQuery';
import { putRequest } from '@/lib';
import { MutatePayload, ProviderResponse } from '@/types';

export const useGetProviders = () => {
  return useQuery<{ providers: Provider[]; totalCount: number }>('/api/provider');
};
export const useGetProvider = (providerId?: string) => {
  return useQuery<ProviderResponse>(`/api/provider/${providerId}`, !!providerId);
};

export const useUpdateProvider = (prop?: MutatePayload) => {
  return useMutation<Partial<Provider>, ProviderResponse>('/api/provider', putRequest, prop);
};

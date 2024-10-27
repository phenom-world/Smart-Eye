'use client';

import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import React, { PropsWithChildren, useContext } from 'react';
import toast from 'react-hot-toast';

import { useLocalStorage } from '@/hooks';
import { ISetState, ObjectData, ProviderResponse, UserResponse } from '@/types';
import { Media, Provider } from '@prisma/client';

export const AuthContext = React.createContext<{
  authUser: UserResponse | null;
  updateUser: ISetState<UserResponse | null>;
  logout: () => Promise<void>;
  clearStorage: () => void;
  updateProviderState: (providerId: string, data: { name: string; theme: string; mediaId: string }) => void;
}>({
  authUser: null,
  updateUser: () => null,
  logout: () => Promise.resolve(),
  clearStorage: () => null,
  updateProviderState: () => null,
});

const AppStateProvider = ({ children }: PropsWithChildren) => {
  const { state, setState, removeItem } = useLocalStorage<UserResponse | null>('authUser', null);

  const router = useRouter();
  const logout = async () => {
    await axios.post('/api/auth/logout');
    toast.success('Logged out successfully');
    removeItem();
    router.replace('/login');
  };

  const updateProviderState = (providerId: string, data: { name: string; theme: string; mediaId: string }) => {
    setState((prev) => ({
      ...(prev as UserResponse),
      provider: {
        ...(prev?.provider as ProviderResponse),
        name: data.name ?? '',
        theme: data.theme ?? '',
        logo: { ...(prev?.provider?.logo as Media), mediaId: data?.mediaId },
      },
      providers: prev?.providers?.map((prov) =>
        prov.uuid === providerId
          ? { ...prov, name: data.name ?? '', theme: data.theme ?? '', logo: { ...(prov.logo as Media), mediaId: data?.mediaId } }
          : prov
      ),
    }));
  };

  return (
    <AuthContext.Provider value={{ authUser: state, updateUser: setState, logout, clearStorage: removeItem, updateProviderState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AppStateProvider;

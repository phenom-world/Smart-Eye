'use client';

import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import React, { PropsWithChildren, useContext } from 'react';
import toast from 'react-hot-toast';

import { useGetAuthUser } from '@/hooks';
import { UserResponse } from '@/types';

type AuthContextType = { user?: UserResponse | null; logout: () => Promise<void> };

export const AuthContext = React.createContext<AuthContextType>({ logout: () => Promise.resolve(), user: null });

const AppStateProvider = ({ children }: PropsWithChildren) => {
  const user = useGetAuthUser();

  const router = useRouter();
  const logout = async () => {
    await axios.post('/api/auth/logout');
    toast.success('Logged out successfully');
    router.replace('/login');
  };

  return <AuthContext.Provider value={{ user: user, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AppStateProvider;

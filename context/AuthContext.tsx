'use client';

import axios from 'axios';
import { useRouter } from 'next-nprogress-bar';
import { useTheme } from 'next-themes';
import React, { PropsWithChildren, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

import { themes } from '@/constants';
import { useGetAuthUser } from '@/hooks';
import { UserResponse } from '@/types';

type AuthContextType = { user?: UserResponse | null; logout: () => Promise<void> };

export const AuthContext = React.createContext<AuthContextType>({ logout: () => Promise.resolve(), user: null });

const AppStateProvider = ({ children }: PropsWithChildren) => {
  const user = useGetAuthUser();
  const { setTheme } = useTheme();

  const router = useRouter();
  const logout = async () => {
    await axios.post('/api/auth/logout');
    toast.success('Logged out successfully');
    router.replace('/login');
  };

  useEffect(() => {
    const theme = themes.find((item) => item.color === user?.provider?.theme)?.theme;
    setTheme(theme!);
  }, [setTheme, user]);

  return <AuthContext.Provider value={{ user: user, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AppStateProvider;

'use client';
import { ReactNode } from 'react';

import NavbarSearch from '@/components/sidebar/nav-search';
import NotificationIcon from '@/components/ui/svg/notification';
import { UserNav } from '@/components/user-nav';
import { AppContextProvider } from '@/context';
import { useAppState } from '@/context/StateContext';
import { cn } from '@/lib';

const NavWrapper = ({ children }: { children: ReactNode }) => {
  const { navOpen } = useAppState();

  return (
    <AppContextProvider>
      <div className="flex justify-between">
        <NavbarSearch />
        <div className={cn('flex-1 h-screen w-full relative overflow-x-hidden transition-margin duration-300', navOpen ? 'md:ml-[266px]' : 'ml-4')}>
          <div className="!sticky z-20 top-0 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-[72px] border-[#E4E4E7] items-center justify-between px-4">
              <div />
              <div className="flex items-center gap-6">
                <NotificationIcon />

                <UserNav />
              </div>
            </div>
          </div>
          <div className="p-4 md:p-2">{children}</div>
        </div>
      </div>
    </AppContextProvider>
  );
};

export default NavWrapper;

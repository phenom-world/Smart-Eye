'use client';
import { ReactNode } from 'react';
import { HiSwitchHorizontal } from 'react-icons/hi';

import NavbarSearch from '@/components/sidebar/nav-search';
import NotificationIcon from '@/components/ui/svg/notification';
import { UserNav } from '@/components/user-nav';
import { useAppState } from '@/context/StateContext';
import { cn } from '@/lib';
import { useAuth } from '@/context/AuthContext';
import { Tooltip } from '@/components/ui';
import { useRouter } from 'next-nprogress-bar';

const NavWrapper = ({ children }: { children: ReactNode }) => {
  const { navOpen } = useAppState();
  const { authUser } = useAuth();
  const router = useRouter();

  return (
    <div className="flex justify-between">
      <NavbarSearch />
      <div className={cn('flex-1 h-screen w-full relative overflow-x-hidden transition-margin duration-300', navOpen ? 'md:ml-[266px]' : 'ml-4')}>
        <div className="!sticky z-20 top-0 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex h-[72px] border-[#E4E4E7] items-center justify-between px-4">
            <div />
            <div className="flex items-center gap-6">
              <NotificationIcon />
              {authUser?.providers && authUser?.providers.length && (
                <Tooltip
                  trigger={
                    <div
                      className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-md inline-flex items-center justify-center"
                      onClick={() => router.push('/select-provider')}
                    >
                      <HiSwitchHorizontal className="text-xl" />
                    </div>
                  }
                >
                  <p>Switch Provider</p>
                </Tooltip>
              )}
              <UserNav />
            </div>
          </div>
        </div>
        <div className="p-4 md:p-2">{children}</div>
      </div>
    </div>
  );
};

export default NavWrapper;

import { Category, People, Setting2, User } from 'iconsax-react';
import { FaChevronLeft } from 'react-icons/fa6';

import { useAppState } from '@/context/StateContext';
import { useMediaQuery } from '@/hooks';
import { cn } from '@/lib';

import LogoIcon from '../ui/svg/dash-logo';
import PieChartIcon from '../ui/svg/pie-chart';
import LinksGroup from './links-group';

function NavbarSearch() {
  const { navOpen, toggleNav } = useAppState();
  const matches = useMediaQuery('(max-width: 768px)');

  const collections = [
    { icon: <Category size={24} color="white" />, label: 'Dashboard', link: '/dashboard' },
    { icon: <User size={24} color="white" />, label: 'Caregivers', initiallynavOpen: false, link: '/caregiver' },
    { icon: <People size={24} color="white" />, label: 'Patients', initiallynavOpen: false, link: '/patient' },
    {
      icon: <PieChartIcon />,
      label: 'Visits',
      initiallynavOpen: false,
      link: '/visit',
    },
    { icon: <Setting2 size={24} color="white" />, label: 'Settings', initiallynavOpen: false, link: '/settings' },
  ];

  const links = collections.map((item) => <LinksGroup {...item} key={item.label} close={matches ? toggleNav : () => null} />);

  return (
    <div className="fixed z-30 h-screen flex">
      {/* side nav */}
      <div
        className={cn(
          'h-full overflow-x-hidden transition-width duration-30 border-r border-r-border/60 px-3 bg-[#06102E] text-white',
          navOpen ? 'w-[266px]' : 'w-0'
        )}
      >
        <div className="flex flex-col justify-between h-full py-8">
          <div className="flex flex-col gap-6">
            <div className="px-3">
              <LogoIcon />
            </div>
            <div className="flex flex-col gap-4">{links.slice(0, -1)}</div>
          </div>
          <div>{links[links.length - 1]}</div>
        </div>
      </div>

      {/* toggleNav icon */}
      <div className={cn('w-6 pt-4 bg-transparent', !navOpen && 'border-r-border border-r w-4')} onClick={toggleNav}>
        <div
          className={cn(
            'w-fit h-fit bg-background z-[60] text-[#06102E] hover:bg-[#06102E] hover:text-background cursor-pointer absolute rounded-full p-1 shadow-[rgba(17,_17,_26,_0.1)_0px_0px_16px] border-border border',
            navOpen ? 'right-3' : '-right-3 transform rotate-180 transition-transform duration-300'
          )}
        >
          <FaChevronLeft size="0.8rem" />
        </div>
      </div>
    </div>
  );
}

export default NavbarSearch;

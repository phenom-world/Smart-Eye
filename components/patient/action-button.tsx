import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { ArchiveBox, Edit, Eye } from 'iconsax-react';
import { LogOutIcon } from 'lucide-react';

import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu';
import UnArchiveIcon from '../ui/svg/unarchive';

type ActionCellProps = {
  callback: (action: 'edit' | 'delete' | 'view' | 'discharge') => void;
  activeTab: string;
};
export default function ActionsCell({ callback, activeTab }: ActionCellProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Open menu" variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted" onClick={(e) => e.stopPropagation()}>
          <DotsVerticalIcon className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-[5px] w-[200px]">
        <DropdownMenuItem onClick={() => callback('view')} className="!px-2">
          <div className="flex items-center gap-2 text-sm leading-5 text-[#09090B] font-normal py-[6px]">
            <DropdownMenuShortcut>
              <Eye size={16} color="#334155" />
            </DropdownMenuShortcut>
            View Details
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => callback('edit')} className="!px-2">
          <div className="flex items-center gap-2 text-sm leading-5 text-[#09090B] font-normal py-[6px]">
            <DropdownMenuShortcut>
              <Edit size={16} />
            </DropdownMenuShortcut>
            Edit Details
          </div>
        </DropdownMenuItem>

        {activeTab !== 'discharged' && activeTab !== 'archived' && (
          <DropdownMenuItem onClick={() => callback('discharge')} className="!px-2">
            <div className="flex items-center gap-2 text-sm leading-5 font-normal py-[6px]">
              <DropdownMenuShortcut>
                <LogOutIcon size={16} className="rotate-180" />
              </DropdownMenuShortcut>
              Discharge
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => callback('delete')} className="!px-2">
          <div className="flex items-center gap-2 text-sm leading-5 font-normal py-[6px]">
            <DropdownMenuShortcut>{activeTab === 'archived' ? <UnArchiveIcon /> : <ArchiveBox size={16} color="#F04438" />}</DropdownMenuShortcut>
            {activeTab === 'archived' ? 'Unarchive Patient' : <span className="text-[#F04438]">Archive Patient</span>}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

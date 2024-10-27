import { DotsVerticalIcon } from '@radix-ui/react-icons';
import { ArchiveBox, Edit, Eye, Key, Repeat, Send } from 'iconsax-react';

import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuShortcut, DropdownMenuTrigger } from '../ui/dropdown-menu';

type ActionCellProps = {
  callback: (action: string) => void;
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
              {activeTab === 'invited' ? (
                <Repeat size={16} color="#334155" />
              ) : activeTab === 'not-invited' ? (
                <Send size={16} color="#334155" />
              ) : (
                <Eye size={16} color="#334155" />
              )}
            </DropdownMenuShortcut>
            {activeTab === 'invited' ? 'Resend invite' : activeTab === 'not-invited' ? 'Send invite' : 'View Details'}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => callback('reset')} className="!px-2">
          <div className="flex items-center gap-2 text-sm leading-5 text-[#09090B] font-normal py-[6px]">
            <DropdownMenuShortcut>
              <Key size={16} />
            </DropdownMenuShortcut>
            Reset Password
          </div>
        </DropdownMenuItem>
        {activeTab !== 'archived' && (
          <DropdownMenuItem onClick={() => callback('edit')} className="!px-2">
            <div className="flex items-center gap-2 text-sm leading-5 text-[#09090B] font-normal py-[6px]">
              <DropdownMenuShortcut>
                <Edit size={16} />
              </DropdownMenuShortcut>
              Edit
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={() => callback('delete')} className="!px-2">
          <div className="flex items-center gap-2 text-sm leading-5 text-[#F04438] font-normal py-[6px]">
            <DropdownMenuShortcut>
              <ArchiveBox size={16} color="#F04438" />
            </DropdownMenuShortcut>
            Archive Accoount
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

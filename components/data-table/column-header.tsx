import { ArrowDownIcon, ArrowUpIcon, CaretSortIcon } from '@radix-ui/react-icons';
import { type Column } from '@tanstack/react-table';

import { cn } from '@/lib';

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  tableKey?: string;
  enableHiding?: boolean;
  sortKey?: string;
  requestSort?: (key: string, value: string) => void;
  modal?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  // tableKey,
  className,
  // enableHiding,
  requestSort,
  sortKey,
  modal,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === 'desc'
                ? `Sorted descending. Click to sort ascending.`
                : column.getIsSorted() === 'asc'
                  ? `Sorted ascending. Click to sort descending.`
                  : `Not sorted. Click to sort ascending.`
            }
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 size-4" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 size-4" aria-hidden="true" />
            ) : (
              <CaretSortIcon className="ml-2 size-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" modal={modal}>
          <DropdownMenuItem
            aria-label="Sort ascending"
            onClick={() => {
              requestSort?.(sortKey as string, 'asc');
              column.toggleSorting(false);
            }}
          >
            <ArrowUpIcon className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem
            aria-label="Sort descending"
            onClick={() => {
              requestSort?.(sortKey as string, 'desc');
              column.toggleSorting(true);
            }}
          >
            <ArrowDownIcon className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
            Desc
          </DropdownMenuItem>
          {/* {enableHiding && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                aria-label="Hide column"
                onClick={() => {
                  if (tableKey) {
                    toggleColumn(tableKey, {
                      key: column.id,
                      visible: false,
                    });
                  }
                  column.toggleVisibility(false);
                }}
              >
                <EyeNoneIcon className="mr-2 size-3.5 text-muted-foreground/70" aria-hidden="true" />
                Hide
              </DropdownMenuItem>
            </>
          )} */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

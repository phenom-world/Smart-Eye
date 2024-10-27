import { type ColumnDef, flexRender, type Table as TanstackTable } from '@tanstack/react-table';

import { cn } from '@/lib';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui';
import VisitEmptyIcon from '../ui/svg/visit-empty';
import { DataTableSkeleton } from './skeleton';

interface DataTableProps<TData, TValue> {
  table: TanstackTable<TData>;
  columns: ColumnDef<TData, TValue>[];
  fetching?: boolean;

  onRowClick?: (row: TData) => void;
  className?: string;
}

export function DataTable<TData, TValue>({ table, fetching, columns, onRowClick, className }: DataTableProps<TData, TValue>) {
  return (
    <div className="w-full space-y-2.5 md:space-y-6 overflow-auto">
      {fetching ? (
        <DataTableSkeleton columnCount={12} filterableColumnCount={0} />
      ) : (
        <>
          <Table boundingClass={`rounded-md border h-[calc(100vh-330px)] scrollbar-hide ${className}`}>
            <TableHeader className="sticky top-0 bg-background z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={cn(
                          (header.id === 'select' || header.id === 'actions') &&
                            'sticky left-0 bg-background dark:group-hover:bg-[#0F1829] group-hover:bg-[#F8F9FB]',
                          header.id === 'select' ? 'left-0' : header.id === 'actions' && 'right-0'
                        )}
                        onClick={() => {
                          header.column.getToggleSortingHandler();
                        }}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table && table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row?.getIsSelected() && 'selected'}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={`${onRowClick && 'cursor-pointer'}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          (cell.column.id === 'select' || cell.column.id === 'actions') &&
                            'sticky bg-background dark:group-hover:bg-[#0F1829] group-hover:bg-[#F8F9FB] group-data-[state=selected]:bg-muted dark:group-data-[state=selected]:bg-muted',
                          cell.column.id === 'select' ? 'left-0' : cell.column.id === 'actions' && 'right-0'
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center bg-white">
                    <div className="flex items-center flex-col gap-4 pt-12 bg-white">
                      <VisitEmptyIcon />
                      <div>
                        <p className="text-[#0F172A] text-base leading-6 font-bold">No Visits Yet </p>
                        <p className="text-xs text-[#64748B] leading-[18px] font-normal mt-1 max-w-[296px]">
                          Visits will appear here once they are scheduled with the patient.
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

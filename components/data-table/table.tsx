import { flexRender, type Table as TanstackTable } from '@tanstack/react-table';

import { cn } from '@/lib';
import { ColType, ISetState, QueryType } from '@/types';

import { SegmentedControlProps, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui';
import EmptyDataIcon from '../ui/svg/data-empty';
import { DataTablePagination } from './pagination';
import { DataTableSkeleton } from './skeleton';
import { DataTableToolbar } from './toolbar';
import { DataTableViewOptions } from './view-options';

interface DataTableProps<TData> {
  table: TanstackTable<TData>;
  rawColumns: ColType[];
  setQuery: ISetState<QueryType>;
  search: string;
  setSearch: (search: string) => void;
  fetching?: boolean;
  segmentedControl?: SegmentedControlProps;
  extraToolbar?: React.ReactNode;
  tableKey: string;
  title?: string;
  subtitle?: string | React.ReactNode;
  onRowClick?: (row: TData) => void;
  className?: string;
  modal?: boolean;
  searchPlaceholder?: string;
  extraEmptybar?: React.ReactNode;
  totalCount?: number;
  segmentedTitle?: string;
}

export function DataTable<TData>({
  table,
  fetching,
  segmentedControl,
  extraToolbar,
  extraEmptybar,
  tableKey,
  title,
  rawColumns,
  subtitle,
  onRowClick,
  className,
  setQuery,
  setSearch,
  totalCount,
  search,
  searchPlaceholder,
  segmentedTitle,
  modal = false,
}: DataTableProps<TData>) {
  return (
    <div className="w-full space-y-2.5 md:space-y-6 overflow-auto">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2.5">
        <div>
          <div className="capitalize text-center md:text-start text-[#101828] text-xl leading-7 md:text-[30px] md:leading-[38px] font-semibold">
            {title}
          </div>
          <div className="text-sm md:text-base leading-6 font-normal text-[#475467]">{subtitle}</div>
        </div>

        <div className="justify-self-end items-center gap-2 flex flex-wrap">
          {false && <DataTableViewOptions table={table} name={tableKey} columns={rawColumns} modal={modal} />}
          {extraToolbar}
        </div>
      </div>

      <DataTableToolbar
        segmentedControl={segmentedControl}
        setQuery={setQuery}
        search={search}
        setSearch={setSearch}
        searchPlaceholder={searchPlaceholder}
        segmentedTitle={segmentedTitle}
      />
      {fetching ? (
        <DataTableSkeleton columnCount={12} filterableColumnCount={0} />
      ) : totalCount === 0 ? (
        <div className="flex justify-center items-center w-full h-[calc(100vh-335px)]">
          <div className="flex flex-col  gap-8 items-center max-w-[352px]">
            <EmptyDataIcon />
            {extraEmptybar}
          </div>
        </div>
      ) : (
        <div>
          <Table boundingClass={`rounded-[16px] border h-[calc(100vh-335px)] scrollbar-hide ${className}`}>
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
              {table.getRowModel().rows.map((row) => (
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
              ))}
            </TableBody>
          </Table>
          <div className="pt-[14px]">
            <DataTablePagination table={table} setQuery={setQuery} />
          </div>
        </div>
      )}
    </div>
  );
}

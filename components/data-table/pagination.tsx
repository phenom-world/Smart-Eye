import { ChevronLeftIcon, ChevronRightIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from '@radix-ui/react-icons';
import { type Table } from '@tanstack/react-table';

import { ISetState, QueryType } from '@/types';

import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSizeOptions?: number[];
  setQuery: ISetState<QueryType>;
}

export function DataTablePagination<TData>({ table, setQuery, pageSizeOptions = [5, 10, 20, 30, 40, 50] }: DataTablePaginationProps<TData>) {
  return (
    <div className="flex w-full flex-col items-center justify-between gap-4 overflow-auto px-2 py-1 sm:flex-row sm:gap-8">
      <div />
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8">
        <div className="flex items-center space-x-2">
          <p className="whitespace-nowrap text-sm font-medium">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
              setQuery((prev) => ({
                ...prev,
                page: table.getState().pagination.pageIndex + 1,
                pageSize: Number(value),
              }));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {pageSizeOptions.map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            aria-label="Go to first page"
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(0);
              setQuery((prev) => ({
                ...prev,
                page: table.getState().pagination.pageIndex + 1,
                pageSize: table.getState().pagination.pageSize,
              }));
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <DoubleArrowLeftIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to previous page"
            variant="outline"
            className="size-8 p-0"
            onClick={() => {
              table.previousPage();
              setQuery((prev) => ({
                ...prev,
                page: table.getState().pagination.pageIndex + 1,
                pageSize: table.getState().pagination.pageSize,
              }));
            }}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to next page"
            variant="outline"
            className="size-8 p-0"
            onClick={() => {
              table.nextPage();
              setQuery((prev) => ({
                ...prev,
                page: table.getState().pagination.pageIndex + 1,
                pageSize: table.getState().pagination.pageSize,
              }));
            }}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon className="size-4" aria-hidden="true" />
          </Button>
          <Button
            aria-label="Go to last page"
            variant="outline"
            className="hidden size-8 p-0 lg:flex"
            onClick={() => {
              table.setPageIndex(table.getPageCount() - 1);
              setQuery((prev) => ({
                ...prev,
                page: table.getState().pagination.pageIndex + 1,
                pageSize: table.getState().pagination.pageSize,
              }));
            }}
            disabled={!table.getCanNextPage()}
          >
            <DoubleArrowRightIcon className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

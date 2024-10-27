'use client';
import { SearchNormal1 } from 'iconsax-react';
import React, { useEffect } from 'react';

import { Input, SegmentedControl, SegmentedControlProps } from '@/components/ui';
import { useDebounce } from '@/hooks';
import { ISetState, QueryType } from '@/types';

interface DataTableToolbarProps {
  segmentedControl?: SegmentedControlProps;
  setQuery: ISetState<QueryType>;
  search: string;
  setSearch: (search: string) => void;
  searchPlaceholder?: string;
  segmentedTitle?: string;
}

const DataTableToolbar = ({ segmentedControl, setSearch, search, setQuery, searchPlaceholder, segmentedTitle }: DataTableToolbarProps) => {
  const debouncedSearch = useDebounce(search, 200);

  useEffect(() => {
    setQuery((prev) => ({
      ...prev,
      search: debouncedSearch,
      pageIndex: 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div className="flex w-full items-center justify-between gap-2.5 overflow-auto flex-col md:flex-row pb-2">
      <div className="flex items-center gap-2.5 justify-center md:justify-start flex-wrap">
        {segmentedTitle ? (
          <div className="capitalize text-center md:text-start text-[#101828] text-xl leading-7 md:text-[30px] md:leading-[38px] font-semibold">
            {segmentedTitle}
          </div>
        ) : (
          segmentedControl && (
            <SegmentedControl
              className="bg-[#F4F4F5]"
              data={segmentedControl.data}
              onChange={segmentedControl.onChange}
              value={segmentedControl.value}
            />
          )
        )}
      </div>

      <div className="relative w-full md:w-[300px]">
        <div className="absolute top-0 left-0 z-[10] flex justify-center items-center h-full pl-[10px]">
          <SearchNormal1 size={14} className="text-[#94A3B8]" />
        </div>
        <Input
          placeholder={searchPlaceholder}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setSearch(event.target.value);
          }}
          className="!w-full focus-visible:ring-0 focus:outline-none focus-visible:ring-offset-0 pl-[33px]"
          value={search}
        />
      </div>
    </div>
  );
};

export { DataTableToolbar };

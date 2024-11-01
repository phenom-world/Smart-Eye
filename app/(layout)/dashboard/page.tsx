'use client';
import dayjs from 'dayjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { Overview } from '@/components/dashboard';
import CheckedVisit from '@/components/dashboard/checked-visit';
import { DataTable } from '@/components/data-table/dash-table';
import Flex from '@/components/flex';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, DateRangePicker, SelectInput } from '@/components/ui';
import ArrowDownIcon from '@/components/ui/svg/arrow-down';
import ArrowupIcon from '@/components/ui/svg/arrow-up';
import FilterLinesIcon from '@/components/ui/svg/filter-lines';
import { initialQuery, visitColumns } from '@/constants';
import { useAuth } from '@/context/AuthContext';
import { useTable } from '@/hooks';
import { useGetVisits } from '@/hooks/request/visit';
import { formatDuration, formatVisitDate, getFullName, getVisitBadgeVariant, getVisitStatus } from '@/lib/utils';
const { useQueryState } = require('nuqs');

export default function DashboardPage() {
  const [filter, setFilter] = useState<(Date | undefined)[]>([undefined, undefined]);
  const [active] = useQueryState('tab', { defaultValue: 'all' });
  const [selectedRange, setSelectedRange] = useState('24 hours');
  const { data, isLoading } = useGetVisits({});
  const [query, setQuery] = React.useState(initialQuery);
  const timeRanges = ['24 hours', '7 days', '30 days'];
  const { user } = useAuth();

  const tableData = React.useMemo(
    () =>
      data?.data?.slice(0, 10)?.map((visit) => ({
        ...visit,
        date: formatVisitDate(visit.visitDate),
        caregiverName: getFullName(visit.caregiver?.firstName, visit.caregiver?.lastName),
        patientName: getFullName(visit.patient?.firstName, visit.patient?.lastName),
        duration: formatDuration(visit.checkinAt, visit.checkoutAt),
        startTime: dayjs(visit.startTime).format('h:mm A'),
        endTime: dayjs(visit.endTime).format('h:mm A'),
        checkinAt: visit.checkinAt ? dayjs(visit.checkinAt).format('h:mm A') : '',
        checkoutAt: visit.checkoutAt ? dayjs(visit.checkoutAt).format('h:mm A') : '',
        visitStatus: <Badge variant={getVisitBadgeVariant(visit)}>{getVisitStatus(visit)}</Badge>,
      })) || [],
    [data]
  );

  const { table, tableColumns, tableKey, requestSort } = useTable({
    data: tableData,
    columns: visitColumns,
    query: query,
    setQuery: setQuery,
    name: 'visits-dashboard',
    resetTableState: active,
    columnProps: {
      selectable: false,
    },
  });

  useEffect(() => {
    requestSort('startTime', 'desc');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="flex-col md:flex max-w-full">
      <div className="flex-1 space-y-6 sm:space-y-8 p-4 md:p-8 ">
        <div className="flex flex-col  justify-between space-y-4 sm:space-y-6">
          <h2 className="text-xl md:text-[30px] leading-[38px] text-[#101828] font-semibold tracking-tight">{user?.provider?.name} Dashboard</h2>
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="inline-flex items-center border border-[#D0D5DD] rounded-[8px] overflow-hidden">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedRange(range)}
                  className={`px-4 py-[10px] text-sm focus:outline-none transition-colors text-[#344054] !leading-5 font-semibold ${
                    selectedRange === range ? 'bg-[#F9FAFB]' : 'bg-white'
                  } ${range !== timeRanges[timeRanges.length - 1] ? 'border-r' : ''} border-gray-300`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className="flex w-full sm:w-fit flex-col gap-4 sm:flex-row items-center sm:gap-3">
              <DateRangePicker
                onChange={(value) => {
                  setFilter(value);
                }}
                value={filter as Date[]}
                className="w-full sm:w-fit"
              />
              <div className="px-4 py-[10px] w-full sm:w-fit justify-center items-center rounded-[8px] border border-[#D0D5DD] flex gap-2 cursor-pointer text-sm text-[#344054] font-semibold leading-5">
                <FilterLinesIcon />
                Filter
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="flex flex-col p-4 sm:p-6 gap-2 rounded-[12px]">
              <CardHeader className="flex flex-row items-center justify-between p-0">
                <CardTitle className="text-sm font-medium text-[#475467] leading-5">Total Visits</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center p-0">
                <div className="text-xl leading-[20px] md:text-[30px] md:leading-[38px] font-semibold text-[#101828]">32</div>
                <div className="text-[#12B76A] bg-[#ECFDF3] flex items-center gap-1 px-[10px] py-1 rounded-full">
                  <ArrowupIcon />
                  <p className="text-sm font-medium text-[#027A48]">10%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col p-4 sm:p-6 gap-2 rounded-[12px]">
              <CardHeader className="flex flex-row items-center justify-between p-0">
                <CardTitle className="text-sm font-medium text-[#475467] leading-5">Confirmed Visits</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center p-0">
                <div className="text-xl leading-[20px] md:text-[30px] md:leading-[38px] font-semibold text-[#101828]">14</div>
                <div className="text-[#12B76A] bg-[#ECFDF3] flex items-center gap-1 px-[10px] py-1 rounded-full">
                  <ArrowupIcon />
                  <p className="text-sm font-medium text-[#027A48]">12%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col p-4 sm:p-6 gap-2 rounded-[12px]">
              <CardHeader className="flex flex-row items-center justify-between p-0">
                <CardTitle className="text-sm font-medium text-[#475467] leading-5">Missed Visits</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center p-0">
                <div className="text-xl leading-[20px] md:text-[30px] md:leading-[38px] font-semibold text-[#101828]">14</div>
                <div className="text-[#12B76A] bg-[#ECFDF3] flex items-center gap-1 px-[10px] py-1 rounded-full">
                  <ArrowupIcon />
                  <p className="text-sm font-medium text-[#027A48]">12%</p>
                </div>
              </CardContent>
            </Card>
            <Card className="flex flex-col p-4 sm:p-6 gap-2 rounded-[12px]">
              <CardHeader className="flex flex-row items-center justify-between p-0">
                <CardTitle className="text-sm font-medium text-[#475467] leading-5">Late Visits</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-between items-center p-0">
                <div className="text-xl leading-[20px] md:text-[30px] md:leading-[38px] font-semibold text-[#101828]">3</div>
                <div className="text-[#F04438] bg-[#FEF3F2] flex items-center gap-1 px-[10px] py-1 rounded-full">
                  <ArrowDownIcon />
                  <p className="text-sm font-medium text-[#B42318]">2%</p>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            <Card className="p-4 sm:p-6 rounded-[12px] flex flex-col gap-5">
              <CardHeader className="!p-0 flex sm:flex-row justify-between sm:items-center gap-2">
                <CardTitle className="text-lg leading-7 font-semibold text-[#101828]">Visits Breakdown</CardTitle>
                <SelectInput
                  field={{
                    onChange: () => null,
                  }}
                  options={[
                    {
                      label: 'This Month',
                      value: 'this-month',
                    },
                  ]}
                  className="w-full sm:w-fit !py-[10px] !px-4 !text-sm !text-[#344054]"
                />
              </CardHeader>
              <CardContent className="!p-0">
                <Overview />
              </CardContent>
            </Card>
            <Card className="p-4 sm:p-6 rounded-[12px] flex flex-col gap-5">
              <CardHeader className="!p-0 flex sm:flex-row justify-between sm:items-center gap-2">
                <CardTitle className="text-lg leading-7 font-semibold text-[#101828]">Checked In visits by month</CardTitle>
                <DateRangePicker
                  onChange={(value) => {
                    setFilter(value);
                  }}
                  value={filter as Date[]}
                  className="w-full sm:w-fit"
                />
              </CardHeader>
              <CardContent className="!p-0">
                <CheckedVisit />
              </CardContent>
            </Card>
          </div>
          <div className="p-4 sm:p-6 flex flex-col gap-5 border border-[#EAECF0] rounded-[12px]">
            <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center">
              <p className="text-lg text-[#101828] font-semibold leading-7">Recent Visits</p>
              <Flex className="gap-2">
                <SelectInput
                  field={{ onChange: () => null }}
                  options={[{ label: 'Today', value: 'Today' }]}
                  className="w-full sm:w-fit !py-[10px] !px-4 !text-sm !text-[#344054]"
                />
                <Link href="/visit">
                  <Button variant="link">View All </Button>
                </Link>
              </Flex>
            </div>
            <DataTable className="h-fit" table={table} fetching={isLoading} columns={tableColumns} key={tableKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

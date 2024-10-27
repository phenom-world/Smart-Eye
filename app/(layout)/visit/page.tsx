'use client';
const { useQueryState } = require('nuqs');
import { VisitStatus } from '@prisma/client';
import dayjs from 'dayjs';
import { Calendar } from 'iconsax-react';
import * as React from 'react';
import { useEffect } from 'react';

import AppLoader from '@/components/app-loader';
import { DataTable, Shell } from '@/components/data-table';
import { Badge, Button } from '@/components/ui';
import ScheduleVisit from '@/components/visit/form/schedule-visit';
import { initialQuery, visitColumns } from '@/constants';
import { useDisclosure, useTable } from '@/hooks';
import { useGetVisits } from '@/hooks/request/visit';
import { formatDuration, formatVisitDate, getFullName, getVisitBadgeVariant, getVisitStatus } from '@/lib';

function VisitPage() {
  const [active, setActive] = useQueryState('tab', { defaultValue: 'all' });
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const { opened, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = React.useState(initialQuery);

  const { data, isLoading, mutate } = useGetVisits({ status: active as VisitStatus });

  const tableData = React.useMemo(
    () =>
      data?.data?.map((visit) => ({
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

  const { table, tableKey, requestSort } = useTable({
    data: tableData,
    columns: visitColumns,
    query: query,
    setQuery: setQuery,
    name: 'visits',
    resetTableState: active,
    columnProps: {
      selectable: false,
    },
  });

  useEffect(() => {
    requestSort('startTime', 'desc');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const closeModal = () => {
    onClose();
  };

  return (
    <Shell>
      <AppLoader loading={isLoading} />
      <ScheduleVisit opened={opened} onClose={closeModal} onSuccessCallback={mutate} />
      <DataTable
        table={table}
        title={'Visits'}
        subtitle="Manage and schedule visits here here"
        searchPlaceholder="Search Visits"
        tableKey={tableKey}
        fetching={isLoading}
        rawColumns={visitColumns}
        setQuery={setQuery}
        search={search}
        setSearch={setSearch}
        segmentedControl={{
          data: [
            { value: 'all', label: 'All' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
            { value: 'missed', label: 'Missed' },
          ],
          value: active || 'all',
          onChange: setActive,
        }}
        extraToolbar={
          <>
            <Button aria-label="add user" variant="default" size="custom" className="!px-8 !py-[10px] !leading-5 lg:flex capitalize" onClick={onOpen}>
              <Calendar size={16} />
              Schedule Visit
            </Button>
          </>
        }
        extraEmptybar={
          <div className="flex flex-col gap-[14px] items-center">
            <p className="text-lg leading-7 text-center font-semibold text-[#0F172A]">No Visits Yet</p>
            <p className="text-base leading-6 text-[#667085] text-center font-normal">
              Click on the button below to schedule a patient to a caregiver
            </p>
            <Button
              aria-label="add user"
              variant="default"
              size="custom"
              className="!px-8 !py-[10px] !w-fit !leading-5 lg:flex capitalize"
              onClick={onOpen}
            >
              <Calendar size={16} />
              Schedule Visit
            </Button>
          </div>
        }
      />
    </Shell>
  );
}

export default VisitPage;

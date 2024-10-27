'use client';
import { Row } from '@tanstack/react-table';
const { useQueryState } = require('nuqs');
import { UserStatus } from '@prisma/client';
import { PlusIcon } from 'lucide-react';
import * as React from 'react';

import AppLoader from '@/components/app-loader';
import ActionsCell from '@/components/caregiver/action-button';
import AddCaregiver from '@/components/caregiver/form/add-caregiver';
import ResetPassword from '@/components/caregiver/form/reset-password';
import { DataTable, Shell } from '@/components/data-table';
import { Alert, Badge, Button } from '@/components/ui';
import { caregiverColumns, initialQuery } from '@/constants';
import { useDisclosure, useGetUsers, useTable, useUpdateUserStatus } from '@/hooks';
import { UserResponse } from '@/types';

import { getAccountStatus, getBadgeVariant, getFullName, modifyDateFields } from '../../../lib';

function CaregiversPage() {
  const [active, setActive] = useQueryState('tab', { defaultValue: 'all' });
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const { opened, onOpen, onClose } = useDisclosure();
  const { opened: opened2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();
  const { opened: opened3, onOpen: onOpen3, onClose: onClose3 } = useDisclosure();
  const [query, setQuery] = React.useState(initialQuery);
  const [selected, setSelected] = React.useState<UserResponse>();
  const [action, setAction] = React.useState<UserStatus | string>();

  const { data: getUsers, isLoading, mutate } = useGetUsers({ status: active, role: 'caregiver' });

  const closeModal = () => {
    onClose();
    onClose2();
    onClose3();
    setAction(undefined);
    setSelected(undefined);
  };

  const { isMutating, trigger } = useUpdateUserStatus({
    onSuccess: () => {
      closeModal();
      mutate();
    },
  });

  const data = React.useMemo(
    () =>
      getUsers?.data?.map((user) => ({
        ...user,
        accountStatus: <Badge variant={getBadgeVariant(user?.status as UserStatus)}>{getAccountStatus(user.status as UserStatus)}</Badge>,
      })) ?? [],
    [getUsers?.data]
  );

  const { table, tableKey } = useTable({
    data: data,
    columns: caregiverColumns,
    query: query,
    setQuery: setQuery,
    name: 'caregivers',
    resetTableState: active,
    columnProps: {
      selectable: false,
      actionsCell: (row: Row<UserResponse>) => (
        <ActionsCell
          callback={(action) => {
            setSelected(modifyDateFields(row.original));
            if (action === 'reset') {
              onOpen2();
            } else if (action === 'delete') {
              setAction('ARCHIVED');
              onOpen3();
            } else {
              setAction(action);
            }
          }}
          activeTab={active}
        />
      ),
    },
  });

  return (
    <Shell>
      <AppLoader loading={isLoading} />
      <Alert
        title={'Archive User'}
        description={`Are you sure you want to archive ${getFullName(selected?.firstName, selected?.lastName)}'s account? The caregiver will no longer be able to log in or access their schedule, but their data will be retained and can be restored at any time.`}
        variant={'destructive'}
        open={opened3}
        onClose={closeModal}
        callback={() => {
          trigger({
            ids: selected ? [selected.uuid] : table.getSelectedRowModel().rows.map((row) => row.original.uuid),
            status: action as UserStatus,
          });
        }}
        btnTitle="Archive Account"
        loading={isMutating}
      />
      <AddCaregiver
        opened={opened || action === 'edit' || action === 'view'}
        onClose={closeModal}
        onSuccessCallback={mutate}
        defaultValues={selected as UserResponse}
        action={action as string}
        setAction={setAction}
      />
      <ResetPassword opened={opened2} onClose={closeModal} selected={selected as UserResponse} onSuccessCallback={mutate} />

      <DataTable
        table={table}
        title={`${active} Caregivers`}
        searchPlaceholder="Search by any field"
        tableKey={tableKey}
        fetching={isLoading}
        rawColumns={caregiverColumns}
        totalCount={data?.length}
        setQuery={setQuery}
        search={search}
        setSearch={setSearch}
        segmentedControl={{
          data: [
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'invited', label: 'Invited' },
            { value: 'not-invited', label: 'Not Invited' },
            { value: 'archived', label: 'Archived' },
          ],
          value: active || 'all',
          onChange: setActive,
        }}
        extraToolbar={
          <>
            <Button aria-label="add user" variant="default" size="custom" className="!px-8 !py-[10px] !leading-5 lg:flex capitalize" onClick={onOpen}>
              <PlusIcon />
              Add Caregiver
            </Button>
          </>
        }
        extraEmptybar={
          <div className="flex flex-col gap-[14px] items-center">
            <p className="text-lg leading-7 text-center font-semibold text-[#0F172A]">You haven't added any caregivers yet</p>
            <p className="text-base leading-6 text-[#667085] text-center font-normal">Click on the button below to add a new caregiver</p>
            <Button aria-label="add user" variant="default" size="custom" className="!px-8 !py-[10px] !leading-5 lg:flex capitalize" onClick={onOpen}>
              <PlusIcon />
              Add Caregiver
            </Button>
          </div>
        }
      />
    </Shell>
  );
}

export default CaregiversPage;

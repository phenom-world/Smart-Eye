'use client';
import { Row } from '@tanstack/react-table';
const { useQueryState } = require('nuqs');
import { AdmissionStatus } from '@prisma/client';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next-nprogress-bar';
import * as React from 'react';

import AppLoader from '@/components/app-loader';
import { DataTable, Shell } from '@/components/data-table';
import ActionsCell from '@/components/patient/action-button';
import AddPatient from '@/components/patient/form/add-patient';
import PromptModal from '@/components/prompt-modal';
import { Alert, Button, Textarea } from '@/components/ui';
import { initialQuery, patientColumns } from '@/constants';
import { useDisclosure, useTable } from '@/hooks';
import { useArchivePatient, useDischargePatient, useGetPatients } from '@/hooks/request/patient';
import { formatDate, modifyDateFields } from '@/lib';
import { PatientResponse } from '@/types';

function PatientsPage() {
  const [active, setActive] = useQueryState('tab', { defaultValue: '' });
  const [admissionStatus, setAdmissionStatus] = React.useState<AdmissionStatus>();
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const { opened, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = React.useState(initialQuery);
  const { data, isLoading, mutate } = useGetPatients({ status: admissionStatus, filter: active });
  const [selected, setSelected] = React.useState<PatientResponse>();
  const router = useRouter();
  const [action, setAction] = React.useState<string>();
  const [dischargeReason, setDischargeReason] = React.useState<string>();

  const closeModal = () => {
    onClose();
    setSelected(undefined);
    setAction(undefined);
    setDischargeReason(undefined);
  };

  const { trigger, isMutating } = useArchivePatient({
    onSuccess: () => {
      closeModal();
      mutate();
    },
  });

  const { trigger: triggerDischarge, isMutating: isMutatingDischarge } = useDischargePatient(selected?.uuid as string, {
    onSuccess: () => {
      closeModal();
      mutate();
    },
  });

  const patients = React.useMemo(() => {
    return data?.data?.map((item) => ({ ...item, birthDate: formatDate(item?.dob), dateCreated: formatDate(item.createdAt) })) ?? [];
  }, [data?.data]);

  const { table, tableKey } = useTable({
    data: patients ?? [],
    columns: patientColumns,
    query: query,
    setQuery: setQuery,
    name: 'patients',
    resetTableState: active,
    columnProps: {
      selectable: false,
      actionsCell: (row: Row<PatientResponse>) => (
        <ActionsCell
          callback={(action) => {
            if (action === 'view') {
              router.push(`/patient/${row.original.id}`);
            } else if (action === 'edit') {
              onOpen();
            } else {
              setAction(action);
            }
            setSelected(modifyDateFields(row.original));
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
        title={active !== 'archived' ? 'Archive Patient' : 'Unarchive Patient'}
        description={`Are you sure you want to ${active !== 'archived' ? 'archive' : 'unarchive'} this patient?`}
        variant={active !== 'archived' ? 'destructive' : 'default'}
        open={action === 'delete'}
        onClose={closeModal}
        callback={() => {
          trigger({
            ids: selected ? [selected.uuid] : table.getSelectedRowModel().rows.map((row) => row.original.uuid),
            status: active !== 'archived' ? 'archived' : 'active',
          });
        }}
        btnTitle={active !== 'archived' ? 'Archive Patient' : 'Unarchive Patient'}
        loading={isMutating}
      />
      <PromptModal
        title="Discharge Patient"
        variant="destructive"
        open={action === 'discharge'}
        onClose={closeModal}
        callback={() => {
          triggerDischarge({
            status: 'discharged',
            reason: dischargeReason as string,
          });
        }}
        primaryLabel="Discharge"
        secondaryVariant="default"
        disabled={!dischargeReason}
        loading={isMutatingDischarge}
      >
        <div className="flex flex-col gap-2 mb-4">
          <p className="font-semibold">Reason for Discharge</p>
          <Textarea value={dischargeReason} onChange={(e) => setDischargeReason(e.target.value)} />
        </div>
      </PromptModal>
      <AddPatient opened={opened} onClose={closeModal} onSuccessCallback={mutate} selected={selected as PatientResponse} />
      <DataTable
        table={table}
        title={'Patients'}
        subtitle="Manage your patients here"
        searchPlaceholder="Search by any field"
        tableKey={tableKey}
        fetching={isLoading}
        rawColumns={patientColumns}
        setQuery={setQuery}
        search={search}
        setSearch={setSearch}
        segmentedControl={{
          data: [
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'discharged', label: 'Discharged' },
            { value: 'archived', label: 'Archived' },
          ],
          value: active || 'all',
          onChange: (value) => {
            setActive(value);
            if (value !== 'all' && value !== 'archived') {
              setAdmissionStatus(value?.toUpperCase() as AdmissionStatus);
            } else {
              setAdmissionStatus(undefined);
            }
          },
        }}
        extraToolbar={
          <>
            <Button aria-label="add user" variant="default" size="custom" className="!px-8 !py-[10px] !leading-5 lg:flex capitalize" onClick={onOpen}>
              <PlusIcon />
              New Patient
            </Button>
          </>
        }
        extraEmptybar={
          <div className="flex flex-col gap-[14px] items-center">
            <p className="text-lg leading-7 text-center font-semibold text-[#0F172A]">You haven't added any patients yet</p>
            <p className="text-base leading-6 text-[#667085] text-center font-normal">Click on the button below to add a new patient</p>
            <Button aria-label="add user" variant="default" size="custom" className="!px-8 !py-[10px] !leading-5 lg:flex capitalize" onClick={onOpen}>
              <PlusIcon />
              New Patient
            </Button>
          </div>
        }
      />
    </Shell>
  );
}

export default PatientsPage;

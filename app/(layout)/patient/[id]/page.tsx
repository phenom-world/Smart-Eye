'use client';
import dayjs from 'dayjs';
import { Calendar, Call, Edit, Location } from 'iconsax-react';
import { ChevronRight } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { ImSpinner8 } from 'react-icons/im';

import AppLoader from '@/components/app-loader';
import { DataTable, Shell } from '@/components/data-table';
import { ImageUpload } from '@/components/image-upload';
import { UploadValue } from '@/components/image-upload/upload';
import { StaticImage } from '@/components/static-image';
import { Badge } from '@/components/ui';
import { initialQuery, patientVisitColumns, visitColumns } from '@/constants';
import { useTable } from '@/hooks';
import { useGetPatient, useUpdatePatient } from '@/hooks/request/patient';
import { useGetPatientVisits } from '@/hooks/request/visit';
import { cn, formatDate, formatDuration, formatVisitDate, getFullName, getVisitBadgeVariant, getVisitStatus, uploadFile } from '@/lib';
import blurDataUrl from '@/lib/generateBlurPlaceholder';
import { getObjectURL } from '@/lib/s3Client';
import { PageProps } from '@/types';
const { useQueryState } = require('nuqs');

const VisitItem = ({ icon, title, details }: { icon: React.ReactNode; title: string; details: string | null | undefined }) => (
  <div className="flex items-start gap-4">
    {icon}
    <div className="flex-1">
      <p className="text-sm leading-[22px] font-semibold text-[#0F172A]">{title}</p>
      <p className="text-sm leading-[22px] font-normal text-[#64748B] mt-1">{details ?? '-'}</p>
    </div>
  </div>
);

const PatientDetails = ({ params: { id } }: PageProps) => {
  const [search, setSearch] = useQueryState('search', { defaultValue: '' });
  const [query, setQuery] = React.useState(initialQuery);
  const { data, isLoading } = useGetPatient({ id });
  const { data: visits, isLoading: isVisitsLoading } = useGetPatientVisits({ id });
  const { trigger, isMutating } = useUpdatePatient({
    onSuccess: () => {
      setSpinner(false);
    },
    message: 'Profile photo updated successfully',
  });

  const [value, setValue] = useState<UploadValue | null>(null);
  const [spinner, setSpinner] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();

  const tableData = React.useMemo(
    () =>
      visits?.data?.map((visit) => ({
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
      })) ?? [],
    [visits]
  );

  const { table, tableKey, requestSort } = useTable({
    data: tableData,
    columns: patientVisitColumns,
    query: query,
    setQuery: setQuery,
    name: 'patient-visits',
    columnProps: {
      selectable: false,
    },
  });

  useEffect(() => {
    requestSort('startTime', 'desc');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lastVisit = useMemo(
    () =>
      visits?.data
        .filter((visit) => new Date(visit.visitDate as Date) <= new Date())
        .sort((a, b) => new Date(b.visitDate as Date).getTime() - new Date(a.visitDate as Date).getTime())[0],
    [visits?.data]
  );

  const nextVisit = useMemo(
    () =>
      visits?.data
        .filter((visit) => new Date(visit.visitDate as Date) > new Date())
        .sort((a, b) => new Date(a.visitDate as Date).getTime() - new Date(b.visitDate as Date).getTime())[0],
    [visits?.data]
  );

  const onUpload = async (value: UploadValue) => {
    let mediaId;
    if (value?.preview) {
      setSpinner(true);
      const response = await uploadFile(value?.value as File, 'profile');
      mediaId = response?.mediaId;
      setSpinner(false);
      if (!response?.success) return;
    }
    trigger({ mediaId, id: data?.data?.uuid as string });
  };

  useEffect(() => {
    if (data?.data?.profilePhoto?.mediaId) {
      getObjectURL(data?.data?.profilePhoto?.mediaId).then((item) => setImageUrl(item));
    }
  }, [data?.data?.profilePhoto?.mediaId]);

  return (
    <Shell>
      <AppLoader loading={isLoading || isVisitsLoading} replace />
      <div>
        <div className="flex flex-col gap-4 md:gap-[26px]">
          <div className="flex items-center gap-[10px] text-sm text-[#71717A] leading-5 font-normal">
            Patient <ChevronRight size={14} /> <span className="text-[#09090B]">{getFullName(data?.data?.firstName, data?.data?.lastName)}</span>
          </div>
          <h4 className="text-[#101828] text-xl leading-7 md:text-[30px] md:leading-[38px] font-semibold">
            {getFullName(data?.data?.firstName, data?.data?.lastName)}
          </h4>
        </div>
        <div className="mt-4 md:mt-8 grid lg:grid-cols-3 items-center shadow shadow-[#3326AE]/[20%] rounded-[12px] gap-4 p-4 md:pt-8 md:pb-6 md:pl-8 md:pr-8 lg:pr-[100px]">
          <div className="flex flex-col justify-center items-center">
            <div className="relative">
              <StaticImage
                src={(value?.preview as string) ?? imageUrl ?? '/images/avatar.png'}
                alt="patient signature"
                imageClassName={cn('object-cover', (spinner || isMutating) && 'opacity-40')}
                className="h-[96px] w-[96px] rounded-full"
                onError={() => setImageUrl(undefined)}
                blurDataURL={blurDataUrl()}
              />
              <div className="bg-[#0F172AE5] p-[7px] rounded-full absolute bottom-1 right-0 cursor-pointer">
                <ImageUpload
                  onFinish={(value) => {
                    setValue(value);
                    onUpload(value);
                  }}
                >
                  <Edit color="white" size={10.06} />
                </ImageUpload>
              </div>

              {(spinner || isMutating) && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <ImSpinner8 className="animate-spin" />
                </div>
              )}
            </div>

            <p className="text-base leading-6 font-semibold text-[#0F172A] items-center mt-[13px] flex gap-2">
              {getFullName(data?.data?.firstName, data?.data?.lastName)}{' '}
              <span
                className={cn(
                  'text-xs leading-4 py-1 px-[10px] rounded-full text-white font-semibold',
                  !data?.data?.active ? 'bg-[#F04438]' : data?.data?.PatientAdmission[0]?.status === 'DISCHARGED' ? 'bg-[#3326AE]' : 'bg-[#12B76A]'
                )}
              >
                {!data?.data?.active ? 'Archived' : data?.data?.PatientAdmission[0]?.status === 'DISCHARGED' ? 'Discharged' : 'Active'}
              </span>
            </p>
            <p className="text-sm leading-[22px] font-normal text-[#64748B] mt-1">
              Intake date: {formatDate(data?.data?.PatientAdmission.find((admission) => admission.status === 'ACTIVE')?.createdAt)}
            </p>
          </div>
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <VisitItem
                icon={<Calendar size={16} color="#475569" />}
                title="Last Visit"
                details={lastVisit?.visitDate ? formatDate(lastVisit?.visitDate) : '-'}
              />
              <VisitItem
                icon={<Calendar size={16} color="#475569" />}
                title="Next Visit"
                details={nextVisit?.visitDate ? formatDate(nextVisit?.visitDate) : '-'}
              />
            </div>
            <div className="flex flex-col gap-4">
              <VisitItem icon={<Location size={16} color="#475569" />} title="Location" details={data?.data?.address} />
              <VisitItem icon={<Call size={16} color="#475569" />} title="Phone" details={data?.data?.phone} />
            </div>
          </div>
        </div>
        <Shell>
          <DataTable
            className="h-[calc(100vh-700px)]"
            table={table}
            searchPlaceholder="Search Visits"
            tableKey={tableKey}
            fetching={isLoading}
            rawColumns={visitColumns}
            setQuery={setQuery}
            search={search}
            setSearch={setSearch}
            segmentedTitle="Visits"
          />
        </Shell>
      </div>
    </Shell>
  );
};

export default PatientDetails;

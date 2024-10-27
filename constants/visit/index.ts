import { ColType } from '@/types';

export const visitColumns: ColType[] = [
  {
    key: 'date',
    label: 'Visit Date',
    visible: true,
  },
  {
    key: 'caregiverName',
    label: 'Caregiver',
    visible: true,
  },
  {
    key: 'patientName',
    label: 'Patient',
    visible: true,
  },

  // {
  //   key: 'startTime',
  //   label: 'Appt. Start Time',
  //   visible: true,
  // },
  // {
  //   key: 'endTime',
  //   label: 'Appt. End Time',
  //   visible: true,
  // },
  {
    key: 'method',
    label: 'Method',
    visible: true,
  },
  {
    key: 'visitStatus',
    label: 'Status',
    visible: true,
  },
  {
    key: 'checkinAt',
    label: 'Check-In Time',
    visible: true,
  },
  {
    key: 'checkoutAt',
    label: 'Check-Out Time',
    visible: true,
  },
  {
    key: 'duration',
    label: 'Duration',
    visible: true,
  },
];

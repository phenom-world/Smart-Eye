import { ColType } from '@/types';

export const patientColumns: ColType[] = [
  {
    key: 'firstName',
    label: 'First Name',
    visible: true,
  },
  {
    key: 'lastName',
    label: 'Last Name',
    visible: true,
  },
  {
    key: 'medicaidNumber',
    label: 'Medicaid ID',
    visible: true,
  },
  {
    key: 'phone',
    label: 'Phone Number',
    visible: true,
  },
  {
    key: 'address',
    label: 'Address',
    visible: true,
  },
  {
    key: 'birthDate',
    label: 'Birth Date',
    visible: true,
  },
  {
    key: 'dateCreated',
    label: 'Date Created',
    visible: true,
  },
];

export const patientVisitColumns: ColType[] = [
  {
    key: 'date',
    label: 'Date',
    visible: true,
  },
  {
    key: 'caregiverName',
    label: 'Caregiver',
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
];

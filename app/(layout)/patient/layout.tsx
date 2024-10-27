import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Patients',
  description: 'Patients page',
};

export default async function PatientsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

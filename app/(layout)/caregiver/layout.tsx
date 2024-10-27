import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Caregivers',
  description: 'Caregivers page',
};

export default async function CaregiversLayout({ children }: { children: React.ReactNode }) {
  return children;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visits',
  description: 'Visits page',
};

export default async function VisitsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

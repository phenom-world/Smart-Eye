import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard page',
};
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}

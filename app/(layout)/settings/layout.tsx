import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Settings page',
};

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}

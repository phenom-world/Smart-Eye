import './globals.css';
import '../pubsub/subscribers';

import type { Metadata } from 'next';

import ProgressBar from '@/components/progress-bar';
import { ThemeProvider } from '@/components/theme-provider';
import { Toast } from '@/components/ui/toast';
import { siteConfig } from '@/config/site';
import { AppContextProvider } from '@/context';
import { SWRProvider } from '@/context/SWRProvider';

export const metadata: Metadata = siteConfig;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body suppressHydrationWarning={true}>
        <Toast />
        <ThemeProvider enableSystem disableTransitionOnChange>
          <SWRProvider>
            <AppContextProvider>{children}</AppContextProvider>
          </SWRProvider>
          <ProgressBar />
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Navigation } from '@/components/Navigation';
import { UsernameSelectionHandler } from '@/features/authentication/components/UsernameSelectionHandler';
import { ReactNode } from 'react';
import './globals.css';
import { FeatureFlagProvider } from '@/components/FeatureFlagProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'optional',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
});

export const metadata: Metadata = {
  title: 'EchoinWhispr',
  description: 'Anonymous messaging platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-background-dark font-sans antialiased ${inter.className}`}>
        <Providers>
          <FeatureFlagProvider>
            <div className="flex flex-col min-h-screen">
              <Navigation />
              <UsernameSelectionHandler />
              <div className="flex flex-1 justify-center w-full">
                {children}
              </div>
            </div>
          </FeatureFlagProvider>
        </Providers>
      </body>
    </html>
  );
}
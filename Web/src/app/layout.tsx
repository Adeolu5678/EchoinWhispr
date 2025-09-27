import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Navigation } from '@/components/Navigation';
import { UsernameSelectionHandler } from '@/features/authentication/components/UsernameSelectionHandler';
import { ReactNode } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
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
    <html lang="en">
      <body className={`${inter.className}`}>
        <Providers>
          <UsernameSelectionHandler />
          <Navigation />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}

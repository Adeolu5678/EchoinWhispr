import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import { WalletProvider } from '../lib/walletProvider';
import './globals.css';

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
  description: 'Decentralized anonymous messaging platform',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`bg-background-dark font-sans antialiased ${inter.className}`}>
        <WalletProvider>
          <div className="flex flex-col min-h-screen">
            <div className="flex flex-1 justify-center w-full">
              {children}
            </div>
          </div>
        </WalletProvider>
      </body>
    </html>
  );
}
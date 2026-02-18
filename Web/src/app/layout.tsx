import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Navigation } from '@/components/Navigation';
import { BottomNavigation } from '@/components/BottomNavigation';
import { UsernameSelectionHandler } from '@/features/authentication/components/UsernameSelectionHandler';
import { ReactNode } from 'react';
import './globals.css';
import { FeatureFlagProvider } from '@/components/FeatureFlagProvider';

// Primary body font - clean and highly readable
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'sans-serif',
  ],
});

// Display font for headings - modern and impactful
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'EchoinWhispr',
  description: 'Anonymous messaging platform - Share your thoughts, secrets, and dreams without judgment.',
  keywords: ['anonymous', 'messaging', 'whisper', 'social', 'privacy'],
  authors: [{ name: 'EchoinWhispr' }],
  openGraph: {
    title: 'EchoinWhispr',
    description: 'Whisper into the void. Hear an echo back.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground antialiased`}
      >
        <Providers>
          <FeatureFlagProvider>
            {/* Global background - clean solid color, page-specific decorations handled by individual pages */}
            
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
            >
              Skip to main content
            </a>
            <div className="relative flex flex-col min-h-screen">
              <Navigation />
              <UsernameSelectionHandler />
              <main id="main-content" className="flex-1 w-full pb-20 md:pb-0">
                {children}
              </main>
              <BottomNavigation />
            </div>
          </FeatureFlagProvider>
        </Providers>
      </body>
    </html>
  );
}
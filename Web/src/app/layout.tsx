import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/Providers'
import { ReactNode } from 'react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
})

export const metadata: Metadata = {
  title: 'EchoinWhispr',
  description: 'Anonymous messaging platform',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  // Add this to any component temporarily to debug
console.log('Clerk Key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY)
console.log('Convex URL:', process.env.NEXT_PUBLIC_CONVEX_URL)
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
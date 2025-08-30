'use client'

import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import convex from '@/lib/convex'
import { ReactNode } from 'react'
import { Toaster } from '@/components/ui/toaster'

/**
 * Providers component
 *
 * Wraps the application with Clerk and Convex providers for authentication and data management.
 * This component must be a client component since ClerkProvider requires client-side rendering.
 *
 * @param children - The child components to render within the providers
 */
interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk
        client={convex}
        useAuth={useAuth}
      >
        {children}
        <Toaster />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}
'use client'

import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import convex from '@/lib/convex'
import { ReactNode, useMemo } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { ClerkErrorBoundary } from '@/components/ClerkErrorBoundary'

/**
 * Validates that the Clerk publishable key environment variable is set
 */
function validateClerkPublishableKey(): string {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    throw new Error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable is not set')
  }

  if (!publishableKey.startsWith('pk_')) {
    throw new Error('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must be a valid Clerk publishable key starting with "pk_"')
  }

  return publishableKey
}

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
  const clerkPublishableKey = useMemo(() => {
    try {
      return validateClerkPublishableKey()
    } catch (error) {
      console.error('Provider initialization failed:', error)
      return null
    }
  }, [])

  if (!clerkPublishableKey) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">Authentication initialization failed</p>
          <p className="text-sm text-muted-foreground">Please refresh the page or try again later.</p>
        </div>
      </main>
    )
  }

  return (
    <ClerkErrorBoundary>
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        afterSignUpUrl="/"
      >
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
          <Toaster />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </ClerkErrorBoundary>
  )
}
'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import convex from '@/lib/convex';
import { ReactNode, useMemo } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { ClerkErrorBoundary } from '@/components/ClerkErrorBoundary';

/**
 * Retrieve and validate the Clerk publishable key from environment variables.
 *
 * @returns The validated publishable key (a string that starts with `pk_`).
 * @throws Error if `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is not set.
 * @throws Error if the publishable key does not start with `pk_`.
 */
function validateClerkPublishableKey(): string {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable is not set'
    );
  }

  if (!publishableKey.startsWith('pk_')) {
    throw new Error(
      'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY must be a valid Clerk publishable key starting with "pk_"'
    );
  }

  return publishableKey;
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
  children: ReactNode;
}

/**
 * Wraps application UI with authentication and data providers, initializing Clerk and Convex.
 *
 * Renders a centered error message if the Clerk publishable key cannot be validated; otherwise returns the children wrapped with ClerkErrorBoundary, ClerkProvider (configured for sign-in/up navigation), ConvexProviderWithClerk (wired to Clerk auth and the Convex client), and a Toaster.
 *
 * @param children - React nodes to render inside the configured providers
 * @returns A React element containing either the provider-wrapped children or an initialization error UI
 */
export function Providers({ children }: ProvidersProps) {
  const clerkPublishableKey = useMemo(() => {
    try {
      return validateClerkPublishableKey();
    } catch (error) {
      console.error('Provider initialization failed:', error);
      return null;
    }
  }, []);

  if (!clerkPublishableKey) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold">
            Authentication initialization failed
          </p>
          <p className="text-sm text-muted-foreground">
            Please refresh the page or try again later.
          </p>
        </div>
      </main>
    );
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
  );
}

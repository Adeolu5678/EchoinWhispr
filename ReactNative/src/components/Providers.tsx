'use client';

import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ReactNode, useMemo } from 'react';
import convex from '../lib/convex';

/**
 * Validates that the Clerk publishable key environment variable is set
 */
function validateClerkPublishableKey(): string {
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable is not set',
    );
  }

  if (!publishableKey.startsWith('pk_')) {
    throw new Error(
      'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY must be a valid Clerk publishable key starting with "pk_"'
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

export function Providers({ children }: ProvidersProps) {
  const publishableKey = useMemo(() => validateClerkPublishableKey(), []);

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

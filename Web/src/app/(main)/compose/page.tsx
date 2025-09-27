'use client';

import { Suspense } from 'react';
import { WhisperComposer } from '@/features/whispers/components/WhisperComposer';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Loading skeleton component for the compose page
 * Displays a simple loading state while the main content loads
 */
const ComposePageSkeleton = () => (
  <div className="container mx-auto px-4 py-8 max-w-2xl">
    <div className="animate-pulse">
      <div className="h-8 bg-deep rounded w-1/3 mb-6"></div>
      <div className="h-32 bg-deep rounded mb-4"></div>
      <div className="h-12 bg-deep rounded"></div>
    </div>
  </div>
);

/**
 * Compose page component for sending whispers
 * Provides a form interface for users to compose and send anonymous messages
 * Includes authentication checks and loading states
 */
export default function ComposePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  // Redirect to sign-in if user is not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  // Show loading state while authentication is being determined
  if (!isLoaded) {
    return <ComposePageSkeleton />;
  }

  // Redirect to sign-in if user is not authenticated
  if (!user) {
    return <ComposePageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-body mb-2">Compose Whisper</h1>
        <p className="text-body/80">
          Send an anonymous message to another user. Your identity will remain
          hidden.
        </p>
      </div>

      <div className="bg-primary rounded-lg shadow-sm border border-deep p-6">
        <Suspense fallback={<ComposePageSkeleton />}>
          <WhisperComposer
            onWhisperSent={() => {
              // Handle successful whisper sending
              console.log('Whisper sent successfully');
            }}
            placeholder="Write your anonymous whisper..."
          />
        </Suspense>
      </div>
    </div>
  );
}

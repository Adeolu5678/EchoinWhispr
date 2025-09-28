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
      <div className="h-8 rounded w-1/3 mb-6"></div>
      <div className="h-32 rounded mb-4"></div>
      <div className="h-12 rounded"></div>
    </div>
  </div>
);

/**
 * Render the compose page that lets authenticated users write and send anonymous whispers.
 *
 * Renders a loading skeleton while authentication state is determined and redirects unauthenticated users to /sign-in.
 *
 * @returns The page's root JSX element containing the header and whisper composer.
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
        <h1 className="text-3xl font-bold mb-2">Compose Whisper</h1>
        <p className="text-gray-600">
          Send an anonymous message to another user. Your identity will remain
          hidden.
        </p>
      </div>

      <div className="rounded-lg shadow-sm border p-6">
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

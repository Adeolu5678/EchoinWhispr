'use client';

import { useAuth } from '@clerk/nextjs';

/**
 * Render a centered test UI that verifies Clerk initialization and displays user status.
 *
 * Shows a spinner and "Loading Clerk..." while Clerk is initializing. Once loaded,
 * displays whether Clerk is loaded and the current user ID or "Not signed in".
 *
 * @returns A React element that shows a loading state until Clerk is initialized, then displays Clerk load status and the current user ID.
 */
function ClerkTestComponent() {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Clerk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Clerk Test Page</h1>
        <p className="mb-4">
          Clerk Status: {isLoaded ? '✅ Loaded' : '❌ Not Loaded'}
        </p>
        <p className="mb-4">User ID: {userId || 'Not signed in'}</p>
        <p className="text-sm text-gray-600">
          If you can see this page, Clerk is working correctly.
        </p>
      </div>
    </div>
  );
}

/**
 * Test page to isolate Clerk integration issues
 */
export default function TestClerkPage() {
  return <ClerkTestComponent />;
}

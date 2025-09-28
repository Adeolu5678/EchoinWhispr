'use client';

import { useAuthStatus } from '@/features/authentication';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

/**
 * Render the application's homepage and its conditional authentication states.
 *
 * Renders a loading screen while auth is initializing, an account-setup error UI if account creation failed, a landing page for unauthenticated visitors, or the authenticated inbox UI with header, welcome message, and sign-out control.
 *
 * @returns The homepage JSX element representing the current authentication state UI.
 */
export default function Home(): JSX.Element {
  const {
    isAuthenticated,
    isLoading,
    user,
    signOut,
    userCreationError,
    isCreatingUser,
  } = useAuthStatus();

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="text-center" role="status" aria-live="polite">
          <div
            className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"
            aria-hidden="true"
          ></div>
          <span className="sr-only">
            {isCreatingUser ? 'Setting up your account...' : 'Loading...'}
          </span>
          <p>
            {isCreatingUser ? 'Setting up your account...' : 'Loading...'}
          </p>
        </div>
      </main>
    );
  }

  if (userCreationError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-deep border border-red-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">
              Account Setup Failed
            </h2>
            <p className="mb-4">
              There was an error setting up your account. Please try signing out
              and signing in again.
            </p>
            <button
              onClick={async () => {
                try {
                  await signOut();
                } catch {
                  /* toast already handled in hook */
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Sign Out & Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">EchoinWhispr</h1>
          <p className="text-lg mb-8">
            Send and receive anonymous messages in a safe, private environment.
          </p>
          <div className="space-y-4">
            <Link
              href="/sign-up"
              className="block w-full bg-deep text-white py-3 px-6 rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/sign-in"
              className="block w-full bg-white text-gray-900 py-3 px-6 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-deep shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">EchoinWhispr</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welcome,{' '}
                {user?.firstName?.trim() ||
                  user?.fullName?.trim()?.split(/\s+/)[0] ||
                  user?.username ||
                  'User'}
              </span>
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } catch {
                    /* toast already handled in hook */
                  }
                }}
                type="button"
                className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Welcome to your Inbox
          </h2>
          <p className="text-lg mb-8">
            Your whispers will appear here. The whisper functionality will be
            implemented next.
          </p>
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium mb-2">No whispers yet</p>
              <p>Your inbox is empty. Whispers you receive will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

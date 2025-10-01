'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { WhisperList } from '@/features/whispers/components/WhisperList';
import { useWhispers } from '@/features/whispers/hooks/useWhispers';

/**
 * Loading skeleton component for the home page
 */
function HomePageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Whisper list skeleton */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Landing page component for unauthenticated users.
 *
 * Displays a welcome message and prompts users to sign in.
 *
 * @returns {JSX.Element} The rendered landing page
 */
function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to EchoinWhispr
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Send and receive anonymous whispers. Your thoughts, shared privately.
          </p>
        </div>
        <div>
          <Link href="/sign-in">
            <Button size="lg" className="w-full">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Home page component for authenticated users.
 *
 * This is the main landing page for authenticated users, displaying their whispers.
 * It integrates with the whispers feature module to fetch and display user data.
 *
 * Features:
 * - Display user's received whispers in a clean list format
 * - Show empty state when no whispers exist
 * - Real-time updates using Convex live queries
 * - Responsive design that works on all screen sizes
 * - Loading states and error handling
 * - Performance optimizations with React Suspense
 *
 * @returns {JSX.Element} The rendered home page
 */
function AuthenticatedHomePage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to EchoinWhispr
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Send and receive anonymous whispers. Your thoughts, shared privately.
        </p>
      </div>

      {/* Whispers List */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Your Whispers</h2>
          <span className="text-sm text-gray-500">
            Received whispers appear here
          </span>
        </div>

        <Suspense fallback={<HomePageSkeleton />}>
          <WhisperListContent />
        </Suspense>
      </div>
    </div>
  );
}

/**
 * Root page component.
 *
 * Checks authentication status and renders appropriate content.
 * For unauthenticated users, displays a landing page with sign-in prompt.
 * For authenticated users, displays the home page with whispers.
 *
 * @returns {JSX.Element} The rendered page
 */
export default function HomePage() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <LandingPage />;
  }

  return <AuthenticatedHomePage />;
}

/**
 * Content component that handles the whisper list logic.
 * Separated for better error boundary isolation and suspense handling.
 */
function WhisperListContent() {
  const { isLoadingWhispers, whispersError, refetchWhispers, markAsRead } = useWhispers();

  // Show loading state
  if (isLoadingWhispers) {
    return <HomePageSkeleton />;
  }

  // Show error state
  if (whispersError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Unable to load whispers
        </h3>
        <p className="text-gray-600 mb-4">
          {whispersError.message ||
            'An unexpected error occurred while loading your whispers.'}
        </p>
        <button
          onClick={() => refetchWhispers()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Show whispers list (handles empty state internally)
  return <WhisperList showMarkAsRead onWhisperMarkAsRead={markAsRead} />;
}

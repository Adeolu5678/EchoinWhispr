'use client';

import { Suspense } from 'react';
import { WhisperList } from '@/features/whispers/components/WhisperList';
import { useWhispers } from '@/features/whispers/hooks/useWhispers';

export const dynamic = 'force-dynamic';

/**
 * Loading skeleton component for the inbox page
 */
function InboxPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page header skeleton */}
      <div className="text-center">
        <div className="animate-pulse">
          <div className="h-8 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 rounded w-2/3 mx-auto"></div>
        </div>
      </div>

      {/* Inbox content skeleton */}
      <div className="rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 rounded w-1/3"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-4 rounded w-full mb-2"></div>
              <div className="h-4 rounded w-3/4 mb-2"></div>
              <div className="h-3 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Inbox page component for authenticated users.
 *
 * This page displays all whispers that have been sent to the current user.
 * It provides a clean interface for viewing received messages with the ability
 * to mark them as read and manage the inbox.
 *
 * Features:
 * - Display all received whispers in chronological order
 * - Mark whispers as read/unread functionality
 * - Real-time updates when new whispers arrive
 * - Responsive design that works on all screen sizes
 * - Loading states and error handling
 * - Performance optimizations with React Suspense
 * - Empty state when no whispers have been received
 *
 * @returns {JSX.Element} The rendered inbox page
 */
export default function InboxPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Your Inbox</h1>
        <p className="text-gray-600">
          View and manage all the anonymous whispers sent to you.
        </p>
      </div>

      {/* Inbox Content */}
      <div className="rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Received Whispers</h2>
          <div className="flex items-center gap-4">
            <UnreadCountBadge />
            <RefreshButton />
          </div>
        </div>

        <Suspense fallback={<InboxPageSkeleton />}>
          <InboxContent />
        </Suspense>
      </div>

      {/* Inbox Tips */}
      <div className="rounded-lg border p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium">
              Inbox Management Tips
            </h3>
            <div className="mt-2 text-sm text-gray-500">
              <ul className="list-disc list-inside space-y-1">
                <li>Mark whispers as read to keep your inbox organized</li>
                <li>
                  All whispers are anonymous - you won&apos;t know who sent them
                </li>
                <li>Whispers are automatically sorted by newest first</li>
                <li>Use the refresh button to check for new messages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Component to display the unread count badge
 */
function UnreadCountBadge() {
  const { unreadCount } = useWhispers();

  if (unreadCount === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-800">
        No unread
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white">
      {unreadCount} unread
    </span>
  );
}

/**
 * Component for the refresh button
 */
function RefreshButton() {
  const { refetchWhispers, isLoadingWhispers } = useWhispers();

  return (
    <button
      onClick={() => refetchWhispers()}
      disabled={isLoadingWhispers}
      className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      aria-label="Refresh inbox"
    >
      {isLoadingWhispers ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className="-ml-0.5 mr-2 h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
      {isLoadingWhispers ? 'Refreshing...' : 'Refresh'}
    </button>
  );
}

/**
 * Content component that handles the inbox logic.
 * Separated for better error boundary isolation and suspense handling.
 */
function InboxContent() {
  const {
    whispers,
    isLoadingWhispers,
    whispersError,
    refetchWhispers,
    markAsRead,
  } = useWhispers();

  // Show loading state
  if (isLoadingWhispers) {
    return <InboxPageSkeleton />;
  }

  // Show error state
  if (whispersError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 mb-4">
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
          Unable to load inbox
        </h3>
        <p className="text-gray-600 mb-4">
          {whispersError.message ||
            'An unexpected error occurred while loading your inbox.'}
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

  // Show empty state if no whispers
  if (!whispers || whispers.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
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
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Your inbox is empty
        </h3>
        <p className="text-gray-600 mb-4">
          You haven&apos;t received any whispers yet. Share your profile to
          start receiving anonymous messages!
        </p>
        <button
          onClick={() => refetchWhispers()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Check Again
        </button>
      </div>
    );
  }

  // Show whispers list
  return (
    <WhisperList
      showMarkAsRead={true}
      onWhisperMarkAsRead={markAsRead}
      emptyStateMessage="No whispers found in your inbox."
      emptyStateActionLabel="Refresh Inbox"
      onEmptyStateAction={refetchWhispers}
    />
  );
}

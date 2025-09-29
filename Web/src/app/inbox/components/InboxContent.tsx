'use client';

/**
 * Content component that handles the inbox logic.
 * Separated for better error boundary isolation and suspense handling.
 */
import { WhisperList } from '@/features/whispers/components/WhisperList';
import { WhisperWithSender } from '@/features/whispers/types';
import { AppError } from '@/lib/errors';

interface InboxContentProps {
  whispers: WhisperWithSender[] | undefined;
  isLoadingWhispers: boolean;
  whispersError: AppError | null;
  refetchWhispers: () => void;
  markAsRead: (whisperId: string) => Promise<void>;
}

export function InboxContent({
  whispers,
  isLoadingWhispers,
  whispersError,
  refetchWhispers,
  markAsRead,
}: InboxContentProps) {
  // Show loading state
  if (isLoadingWhispers) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12 animate-spin"
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
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Loading your inbox...
        </h3>
        <p className="text-gray-600">
          Please wait while we fetch your whispers.
        </p>
      </div>
    );
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
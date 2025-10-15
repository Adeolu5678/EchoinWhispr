'use client';

import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useInboxData } from '@/features/inbox/hooks/useInboxData';
import { UnreadCountBadge } from './components/UnreadCountBadge';
import { RefreshButton } from './components/RefreshButton';
import { InboxContent } from './components/InboxContent';
import { ConversationList } from '@/features/conversations/components/ConversationList';

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

      {/* Tabs skeleton */}
      <div className="rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 rounded w-full"></div>
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
 * Inbox page component for authenticated users with two-section functionality.
 *
 * This page displays both whispers and conversations in a unified inbox interface.
 * It provides a clean tabbed interface for viewing received messages and active conversations.
 *
 * Features:
 * - Two-section inbox with "Whispers" and "Conversations" tabs
 * - Display whispers and conversations in chronological order
 * - Mark whispers as read/unread functionality
 * - Real-time updates when new whispers or conversations arrive
 * - Responsive design that works on all screen sizes
 * - Loading states and error handling
 * - Performance optimizations with React Suspense
 * - Empty states when no whispers or conversations exist
 * - Combined unread count display
 *
 * @returns {JSX.Element} The rendered inbox page
 */
export default function InboxPage() {
  // Extract all necessary data from the combined inbox hook
  const {
    whispers,
    isLoadingWhispers,
    whispersError,
    conversations,
    isLoadingConversations,
    conversationsError,
    isLoading,
    hasError,
    error,
    totalUnreadCount,
    refetchAll,
    markAsRead,
  } = useInboxData();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Your Inbox</h1>
        <p className="text-gray-600">
          View and manage all your anonymous whispers and conversations.
        </p>
      </div>

      {/* Inbox Content with Tabs */}
      <div className="rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Messages</h2>
          <div className="flex items-center gap-4">
            <UnreadCountBadge unreadCount={totalUnreadCount} />
            <RefreshButton
              refetchWhispers={refetchAll}
              isLoadingWhispers={isLoading}
            />
          </div>
        </div>

        <Tabs defaultValue="whispers" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="whispers" aria-label="View whispers tab">
              Whispers
            </TabsTrigger>
            <TabsTrigger value="conversations" aria-label="View conversations tab">
              Conversations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whispers" className="mt-6">
            <Suspense fallback={<InboxPageSkeleton />}>
              <InboxContent
                whispers={whispers}
                isLoadingWhispers={isLoadingWhispers}
                whispersError={whispersError}
                refetchWhispers={refetchAll}
                markAsRead={markAsRead}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="conversations" className="mt-6">
            <Suspense fallback={<InboxPageSkeleton />}>
              <ConversationList
                conversations={conversations}
                isLoading={isLoadingConversations}
                error={conversationsError}
                onRefresh={refetchAll}
              />
            </Suspense>
          </TabsContent>
        </Tabs>
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
                  All whispers are anonymous - you will not know who sent them
                </li>
                <li>Whispers are automatically sorted by newest first</li>
                <li>Conversations appear when someone replies to your echo</li>
                <li>Use the refresh button to check for new messages</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
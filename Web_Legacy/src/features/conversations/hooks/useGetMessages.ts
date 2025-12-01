import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Id } from '@/lib/convex';

/**
 * Hook for fetching messages in a conversation.
 *
 * @param conversationId - The ID of the conversation to fetch messages for
 * @returns Object containing messages array and loading state
 */
export const useGetMessages = (conversationId: string) => {
  const messages = useQuery(api.conversations.getMessages, { conversationId: conversationId as Id<'conversations'> });

  return {
    messages: messages || [],
    isLoading: messages === undefined,
  };
};
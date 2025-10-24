import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';

/**
 * Hook to fetch conversations for the current user.
 * Returns conversations where the user is a participant and status is 'active'.
 *
 * @returns Object containing conversations array, loading state, and error.
 */
export const useGetConversations = () => {
  const conversations = useQuery(api.conversations.getActiveConversations);

  return {
    conversations,
    isLoading: conversations === undefined,
    error: null, // Convex handles errors internally
  };
};
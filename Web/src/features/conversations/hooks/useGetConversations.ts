import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';

/**
 * Hook to fetch conversations for the current user.
 * Returns conversations where the user is a participant and status is 'active'.
 *
 * @returns Object containing conversations array, loading state, and error.
 */
export const useGetConversations = () => {
  // Note: Backend getActiveConversations takes paginationOpts but actually uses take(200) + filter
  // It returns a plain array, not a paginated result object
  const conversations = useQuery(api.conversations.getActiveConversations, { paginationOpts: { numItems: 20, cursor: null } });

  return {
    conversations: conversations || [],
    isLoading: conversations === undefined,
    error: null, // Convex handles errors internally
  };
};

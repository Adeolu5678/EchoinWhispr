import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';

/**
 * Hook to fetch conversations for the current user.
 * Returns conversations where the user is a participant and status is 'active'.
 * Note: Backend uses take(200) internally, pagination not currently supported.
 *
 * @returns Object containing conversations array, loading state, and error.
 */
export const useGetConversations = () => {
  // Backend getActiveConversations uses take(200) + filter internally
  // paginationOpts is required by API signature but ignored by implementation
  const conversations = useQuery(api.conversations.getActiveConversations, { 
    paginationOpts: { numItems: 200, cursor: null } 
  });

  return {
    conversations: conversations || [],
    isLoading: conversations === undefined,
    error: null, // Convex handles errors internally
  };
};

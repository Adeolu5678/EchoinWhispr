import { useWhispers } from '@/features/whispers/hooks/useWhispers';
import { useGetConversations } from '@/features/conversations/hooks/useGetConversations';

/**
 * Combined hook for fetching all inbox data (whispers and conversations).
 * Provides a unified interface for the inbox page to access both types of data.
 *
 * @returns Object containing whispers, conversations, loading states, and error states
 */
export const useInboxData = () => {
  // Fetch whispers data using existing hook
  const {
    whispers,
    isLoadingWhispers,
    whispersError,
    unreadCount: whisperUnreadCount,
    refetchWhispers,
    markAsRead,
  } = useWhispers();

  // Fetch conversations data using existing hook
  const {
    conversations,
    isLoading: isLoadingConversations,
    error: conversationsError,
  } = useGetConversations();

  // Calculate total unread count (whispers + conversations)
  const totalUnreadCount = whisperUnreadCount;

  // Determine overall loading state
  const isLoading = isLoadingWhispers || isLoadingConversations;

  // Determine if there's any error
  const hasError = whispersError || conversationsError;
  const error = whispersError || conversationsError;

  // Combined refetch function
  const refetchAll = () => {
    refetchWhispers();
  };

  return {
    // Whispers data
    whispers: whispers || [],
    isLoadingWhispers,
    whispersError,

    // Conversations data
    conversations: conversations || [],
    isLoadingConversations,
    conversationsError,

    // Combined data
    isLoading,
    hasError,
    error,
    totalUnreadCount,

    // Actions
    refetchAll,
    markAsRead,
  };
};
import { useState, useCallback } from 'react';
import { useConvex } from 'convex/react';
import { api } from '@/lib/convex';
import { useWhispers } from '@/features/whispers/hooks/useWhispers';
import { useGetConversations } from '@/features/conversations/hooks/useGetConversations';

export const useInboxData = () => {
  const convex = useConvex();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    whispers,
    isLoadingWhispers,
    whispersError,
    unreadCount: whisperUnreadCount,
    hasMore,
    isLoadingMore,
    loadMore,
    refetchWhispers,
    markAsRead,
  } = useWhispers();

  const {
    conversations,
    isLoading: isLoadingConversations,
    error: conversationsError,
  } = useGetConversations();

  const totalUnreadCount = whisperUnreadCount;

  const isLoading = isLoadingWhispers || isLoadingConversations;

  const hasError = whispersError || conversationsError;
  const error = whispersError || conversationsError;

  const refetchAll = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        convex.query(api.whispers.getAllReceivedWhispers, {}),
        convex.query(api.conversations.getActiveConversations, { paginationOpts: { numItems: 200, cursor: null } }),
      ]);
      refetchWhispers();
    } finally {
      setIsRefreshing(false);
    }
  }, [convex, refetchWhispers]);

  return {
    whispers: whispers || [],
    isLoadingWhispers,
    whispersError,
    hasMore,
    isLoadingMore,
    loadMore,

    conversations: conversations || [],
    isLoadingConversations,
    conversationsError,

    isLoading,
    isRefreshing,
    hasError,
    error,
    totalUnreadCount,

    refetchAll,
    markAsRead,
  };
};
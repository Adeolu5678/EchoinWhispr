import { useState, useCallback } from 'react';
import { useWhispers } from '@/features/whispers/hooks/useWhispers';
import { useGetConversations } from '@/features/conversations/hooks/useGetConversations';

export const useInboxData = () => {
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
      await refetchWhispers();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetchWhispers]);

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
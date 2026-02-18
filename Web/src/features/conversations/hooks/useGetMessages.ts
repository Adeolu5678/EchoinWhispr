import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Id, Doc } from '@/lib/convex';

export interface PaginatedMessagesResponse {
  messages: Doc<'messages'>[];
  nextCursor: number | null;
  hasMore: boolean;
}

export const useGetMessages = (conversationId: string): {
  messages: Doc<'messages'>[];
  nextCursor: number | null;
  hasMore: boolean;
  isLoading: boolean;
} => {
  const result = useQuery(api.conversations.getMessages, { conversationId: conversationId as Id<'conversations'> }) as PaginatedMessagesResponse | undefined;

  return {
    messages: result?.messages || [],
    nextCursor: result?.nextCursor ?? null,
    hasMore: result?.hasMore ?? false,
    isLoading: result === undefined,
  };
};

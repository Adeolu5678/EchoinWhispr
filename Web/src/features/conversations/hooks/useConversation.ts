import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import type { GenericId } from 'convex/values';
import type { Conversation, Message } from '../types';
import { Doc } from '@/lib/convex';

interface PaginatedMessagesResponse {
  messages: Doc<'messages'>[];
  nextCursor: number | null;
  hasMore: boolean;
}

export const useConversation = (conversationId: GenericId<"conversations"> | null): {
  conversation: Conversation | null,
  messages: Message[],
  isLoading: boolean,
  nextCursor: number | null,
  hasMore: boolean
} => {
  const conversation = useQuery(api.conversations.getConversation, conversationId ? { conversationId } : 'skip');
  const messagesResult = useQuery(api.conversations.getMessages, conversationId ? { conversationId } : 'skip') as PaginatedMessagesResponse | undefined;

  const isLoading = conversation === undefined || messagesResult === undefined;

  return {
    conversation: conversation || null,
    messages: messagesResult?.messages || [],
    nextCursor: messagesResult?.nextCursor ?? null,
    hasMore: messagesResult?.hasMore ?? false,
    isLoading,
  };
};

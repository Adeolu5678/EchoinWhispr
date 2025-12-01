import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import type { GenericId } from 'convex/values';
import type { Conversation, Message } from '../types';

/**
 * Hook to fetch a specific conversation by ID.
 * Includes conversation details and associated messages.
 *
 * @param conversationId - The ID of the conversation to fetch
 * @returns Object containing conversation data, messages, and loading state
 */
export const useConversation = (conversationId: GenericId<"conversations"> | null): {
  conversation: Conversation | null,
  messages: Message[],
  isLoading: boolean
} => {
  const conversation = useQuery(api.conversations.getConversation, conversationId ? { conversationId } : 'skip');
  const messages = useQuery(api.conversations.getMessages, conversationId ? { conversationId } : 'skip');

  const isLoading = conversation === undefined || messages === undefined;

  return {
    conversation: conversation || null,
    messages: messages || [],
    isLoading,
  };
};
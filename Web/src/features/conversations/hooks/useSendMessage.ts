import { useMutation } from 'convex/react';
import { api, Id } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for sending messages in conversations.
 *
 * @returns Object containing sendMessage function and loading state
 */
export const useSendMessage = () => {
  const sendMessageMutation = useMutation(api.conversations.sendMessage);
  const { toast } = useToast();

  /**
   * Send a message in a conversation.
   *
   * @param conversationId - The ID of the conversation
   * @param content - The message content to send
   * @returns Promise resolving to the message ID
   */
  const sendMessage = async (conversationId: Id<'conversations'>, content: string) => {
    try {
      // Client-side validation
      if (!content.trim()) {
        throw new Error('Message content cannot be empty');
      }

      if (content.length > 1000) {
        throw new Error('Message content cannot exceed 1000 characters');
      }

      const messageId = await sendMessageMutation({
        conversationId,
        content: content.trim(),
      });

      return messageId;
    } catch (error) {
      console.error('Failed to send message:', error);

      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    }
  };

  return {
    sendMessage,
    isLoading: false, // Convex mutations don't expose loading state directly
  };
};
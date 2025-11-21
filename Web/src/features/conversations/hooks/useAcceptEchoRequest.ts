import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import type { GenericId } from 'convex/values';

/**
 * Hook for accepting echo requests to start conversations.
 *
 * @returns Object containing the acceptEchoRequest function and loading state.
 */
export const useAcceptEchoRequest = (): { acceptEchoRequest: (conversationId: GenericId<"conversations">) => Promise<void>, isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const acceptEchoRequestMutation = useMutation(api.conversations.acceptEchoRequest);

  /**
   * Accepts an echo request by updating the conversation status to 'active'.
   * This reveals identities and starts the two-way conversation.
   *
   * @param conversationId - The ID of the conversation to accept
   */
  const acceptEchoRequest = useCallback(async (conversationId: GenericId<"conversations">) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await acceptEchoRequestMutation({ conversationId });
      toast({
        title: "Echo request accepted",
        description: "The conversation has started and identities are now revealed.",
      });
    } catch (error) {
      console.error('Failed to accept echo request:', error);
      toast({
        title: "Failed to accept echo request",
        description: "An error occurred while accepting the echo request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, acceptEchoRequestMutation, toast]);

  return {
    acceptEchoRequest,
    isLoading,
  };
};

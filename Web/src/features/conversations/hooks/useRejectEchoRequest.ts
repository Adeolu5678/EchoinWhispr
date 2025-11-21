import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import type { GenericId } from 'convex/values';

/**
 * Hook for rejecting echo requests to close conversations.
 *
 * @returns Object containing the rejectEchoRequest function and loading state.
 */
export const useRejectEchoRequest = (): { rejectEchoRequest: (conversationId: GenericId<"conversations">) => Promise<void>, isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const rejectEchoRequestMutation = useMutation(api.conversations.rejectEchoRequest);

  /**
   * Rejects an echo request by updating the conversation status to 'closed'.
   * This closes the conversation without revealing identities.
   *
   * @param conversationId - The ID of the conversation to reject
   */
  const rejectEchoRequest = useCallback(async (conversationId: GenericId<"conversations">) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await rejectEchoRequestMutation({ conversationId });
      toast({
        title: "Echo request rejected",
        description: "The echo request has been rejected and the conversation is closed.",
      });
    } catch (error) {
      console.error('Failed to reject echo request:', error);
      toast({
        title: "Failed to reject echo request",
        description: "An error occurred while rejecting the echo request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, rejectEchoRequestMutation, toast]);

  return {
    rejectEchoRequest,
    isLoading,
  };
};

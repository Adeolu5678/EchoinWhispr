import { useCallback, useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import type { GenericId } from 'convex/values';

/**
 * Hook for sending echo requests to initiate conversations.
 *
 * @returns Object containing the sendEchoRequest function and loading state.
 */
export const useSendEchoRequest = (): { sendEchoRequest: (whisperId: GenericId<"whispers">) => Promise<void>, isLoading: boolean } => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const sendEchoRequestMutation = useMutation(api.conversations.sendEchoRequest);

  /**
   * Sends an echo request for a whisper by initiating a conversation.
   * This creates a conversation record with status 'initiated'.
   *
   * @param whisperId - The ID of the whisper to echo back
   */
  const sendEchoRequest = useCallback(async (whisperId: GenericId<"whispers">) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await sendEchoRequestMutation({ whisperId });
      toast({
        title: "Echo request sent",
        description: "Your echo request has been sent successfully.",
      });
    } catch (error) {
      console.error('Failed to send echo request:', error);
      toast({
        title: "Failed to send echo request",
        description: "An error occurred while sending your echo request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, sendEchoRequestMutation, toast]);

  return {
    sendEchoRequest,
    isLoading,
  };
};

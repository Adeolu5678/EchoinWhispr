import { useCallback } from 'react';
import type { Id } from 'convex/values';

/**
 * Hook for sending echo requests to initiate conversations.
 *
 * @returns Object containing the sendEchoRequest function and loading state.
 */
export const useSendEchoRequest = (): { sendEchoRequest: (whisperId: Id<"whispers">) => Promise<void>, isLoading: boolean } => {
  /**
   * Placeholder function for sending echo requests.
   * Currently does nothing since CONVERSATION_EVOLUTION is disabled.
   *
   * @param whisperId - The ID of the whisper to echo back
   */
  const sendEchoRequest = useCallback(async (whisperId: Id<"whispers">) => {
    // TODO: Implement when CONVERSATION_EVOLUTION feature is enabled
    console.log('Echo request placeholder - whisperId:', whisperId);
  }, []);

  return {
    sendEchoRequest,
    isLoading: false,
  };
};

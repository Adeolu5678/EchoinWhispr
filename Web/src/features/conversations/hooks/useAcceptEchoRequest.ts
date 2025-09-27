import { useCallback } from 'react';

/**
 * Hook for accepting echo requests.
 *
 * This is a foundation placeholder for the CONVERSATION_EVOLUTION feature.
 * Currently returns a no-op function since the feature is disabled for MVP.
 */
export const useAcceptEchoRequest = (): { acceptEchoRequest: (requestId: string) => Promise<void>, isLoading: boolean } => {
  /**
   * Placeholder function for accepting echo requests.
   * Currently does nothing since CONVERSATION_EVOLUTION is disabled.
   *
   * @param requestId - The ID of the echo request to accept
   */
  const acceptEchoRequest = useCallback(async (requestId: string) => {
    // TODO: Implement when CONVERSATION_EVOLUTION feature is enabled
    console.log('Accept echo request placeholder - requestId:', requestId);
  }, []);

  return {
    acceptEchoRequest,
    isLoading: false,
  };
};

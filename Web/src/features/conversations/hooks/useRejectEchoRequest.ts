import { useCallback } from 'react';

/**
 * Hook for rejecting echo requests.
 *
 * This is a foundation placeholder for the CONVERSATION_EVOLUTION feature.
 * Currently returns a no-op function since the feature is disabled for MVP.
 */
export const useRejectEchoRequest = (): { rejectEchoRequest: (requestId: string) => Promise<void>, isLoading: boolean } => {
  /**
   * Placeholder function for rejecting echo requests.
   * Currently does nothing since CONVERSATION_EVOLUTION is disabled.
   *
   * @param requestId - The ID of the echo request to reject
   */
  const rejectEchoRequest = useCallback(async (requestId: string) => {
    // TODO: Implement when CONVERSATION_EVOLUTION feature is enabled
    console.log('Reject echo request placeholder - requestId:', requestId);
  }, []);

  return {
    rejectEchoRequest,
    isLoading: false,
  };
};

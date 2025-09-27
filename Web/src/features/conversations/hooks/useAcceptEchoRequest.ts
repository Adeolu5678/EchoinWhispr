import { useCallback } from 'react';
import type { Id } from 'convex/values';

/**
 * Hook for accepting echo requests.
 *
 * This is a foundation placeholder for the CONVERSATION_EVOLUTION feature.
 * Currently returns a no-op function since the feature is disabled for MVP.
 */
export const useAcceptEchoRequest = (): { acceptEchoRequest: (requestId: Id<"echoRequests">) => Promise<void>, isLoading: boolean } => {
  /**
   * Placeholder function for accepting echo requests.
   * Currently does nothing since CONVERSATION_EVOLUTION is disabled.
   *
   * @param requestId - The ID of the echo request to accept
   */
  const acceptEchoRequest = useCallback(async (requestId: Id<"echoRequests">) => {
    // TODO: Implement when CONVERSATION_EVOLUTION feature is enabled
    console.log('Accept echo request placeholder - requestId:', requestId);
  }, []);

  return {
    acceptEchoRequest,
    isLoading: false,
  };
};

import { EchoRequest } from '../types';

/**
 * Hook for getting pending echo requests for the current user.
 *
 * This is a foundation placeholder for the CONVERSATION_EVOLUTION feature.
 * Currently returns empty array since the feature is disabled for MVP.
 */
export const useGetEchoRequests = () => {
  // TODO: Uncomment when CONVERSATION_EVOLUTION feature is enabled
  // const echoRequests = useQuery(api.conversations.getEchoRequests);

  // Placeholder: return empty array for MVP
  const echoRequests: EchoRequest[] = [];

  return {
    echoRequests,
    isLoading: false,
  };
};

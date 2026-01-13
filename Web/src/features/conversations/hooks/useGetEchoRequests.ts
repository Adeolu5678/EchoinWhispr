import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Conversation } from '../types';

/**
 * Hook to fetch echo requests for the current user.
 * Echo requests are initiated conversations where the user is the sender of the initial whisper.
 * 
 * Note: Currently limited to first 20 items. Full pagination is not exposed.
 * The backend supports cursor-based pagination but this hook hardcodes the initial page.
 *
 * @returns Object containing the echo requests data and loading state.
 */
export const useGetEchoRequests = (): { echoRequests: Conversation[], isLoading: boolean } => {
  // Note: Hardcoded to first page (20 items). For users with >20 echo requests,
  // additional pagination controls would need to be implemented.
  const data = useQuery(api.conversations.getEchoRequests, { paginationOpts: { numItems: 20, cursor: null } });
  const isLoading = data === undefined;

  return {
    echoRequests: data?.page ?? [],
    isLoading,
  };
};


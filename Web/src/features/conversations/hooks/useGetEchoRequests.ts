import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Conversation } from '../types';

/**
 * Hook to fetch echo requests for the current user.
 * Echo requests are initiated conversations where the user is the sender of the initial whisper.
 *
 * @returns Object containing the echo requests data and loading state.
 */
export const useGetEchoRequests = (): { echoRequests: Conversation[], isLoading: boolean } => {
  const data = useQuery(api.conversations.getEchoRequests, { paginationOpts: { numItems: 20, cursor: null } });
  const isLoading = data === undefined;

  return {
    echoRequests: data?.page ?? [],
    isLoading,
  };
};


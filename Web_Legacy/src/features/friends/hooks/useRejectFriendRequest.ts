import { useMutation } from 'convex/react';
import { useCallback } from 'react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import type { Id } from '@/lib/convex';

/**
 * Hook for rejecting friend requests.
 *
 * Uses Convex's rejectFriendRequest mutation to reject incoming friend requests.
 * Provides loading state and error handling with toast notifications.
 *
 * @returns Object containing rejectFriendRequest function and loading state
 *
 * @example
 * ```tsx
 * const { rejectFriendRequest, isLoading } = useRejectFriendRequest();
 *
 * const handleReject = async (requestId: Id<'friends'>) => {
 *   await rejectFriendRequest(requestId);
 * };
 * ```
 */
export const useRejectFriendRequest = () => {
  const { toast } = useToast();
  const rejectMutation = useMutation(api.friends.rejectFriendRequest);

  /**
   * Reject a friend request by its ID.
   *
   * @param requestId - The ID of the friend request to reject
   * @throws Will show error toast if rejection fails
   */
  const rejectFriendRequest = useCallback(
    async (requestId: Id<'friends'>) => {
      try {
        await rejectMutation({ requestId });
        toast({
          title: 'Friend request rejected',
          description: 'The request has been declined.',
        });
      } catch (error) {
        console.error('Failed to reject friend request:', error);
        toast({
          title: 'Failed to reject friend request',
          description: 'Please try again later.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [rejectMutation, toast]
  );

  return {
    rejectFriendRequest,
    isLoading: false, // Convex mutations don't provide loading state
  };
};
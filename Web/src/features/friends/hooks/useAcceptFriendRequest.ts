import { useMutation } from 'convex/react';
import { useCallback } from 'react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import { Id } from '@/lib/convex';

/**
 * Hook for accepting friend requests.
 *
 * Uses Convex's acceptFriendRequest mutation to accept incoming friend requests.
 * Provides loading state and error handling with toast notifications.
 *
 * @returns Object containing acceptFriendRequest function and loading state
 *
 * @example
 * ```tsx
 * const { acceptFriendRequest, isLoading } = useAcceptFriendRequest();
 *
 * const handleAccept = async (requestId: Id<'friends'>) => {
 *   await acceptFriendRequest(requestId);
 * };
 * ```
 */
export const useAcceptFriendRequest = () => {
  const { toast } = useToast();
  const acceptMutation = useMutation(api.friends.acceptFriendRequest);

  /**
   * Accept a friend request by its ID.
   *
   * @param requestId - The ID of the friend request to accept
   * @throws Will show error toast if acceptance fails
   */
  const acceptFriendRequest = useCallback(
    async (requestId: Id<'friends'>) => {
      try {
        await acceptMutation({ requestId });
        toast({
          title: 'Friend request accepted',
          description: 'You are now friends!',
        });
      } catch (error) {
        console.error('Failed to accept friend request:', error);
        toast({
          title: 'Failed to accept friend request',
          description: 'Please try again later.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [acceptMutation, toast]
  );

  return {
    acceptFriendRequest,
    isLoading: false, // Convex mutations don't provide loading state
  };
};
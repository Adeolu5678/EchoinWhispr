import { useMutation } from 'convex/react';
import { useCallback } from 'react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import type { Id } from '@/lib/convex';

/**
 * Hook for removing friends or canceling sent friend requests.
 *
 * Uses Convex's removeFriend mutation to remove friendships or cancel pending requests.
 * Provides loading state and error handling with toast notifications.
 *
 * @returns Object containing removeFriend function and loading state
 *
 * @example
 * ```tsx
 * const { removeFriend, isLoading } = useRemoveFriend();
 *
 * const handleRemove = async (friendshipId: Id<'friends'>) => {
 *   await removeFriend(friendshipId);
 * };
 * ```
 */
export const useRemoveFriend = () => {
  const { toast } = useToast();
  const removeMutation = useMutation(api.friends.removeFriend);

  /**
   * Remove a friend or cancel a sent friend request by its friendship ID.
   *
   * @param friendshipId - The ID of the friendship or friend request to remove
   * @throws Will show error toast if removal fails
   */
  const removeFriend = useCallback(
    async (friendshipId: Id<'friends'>) => {
      try {
        await removeMutation({ friendshipId });
        toast({
          title: 'Friend removed',
          description: 'The friendship has been removed.',
        });
      } catch (error) {
        console.error('Failed to remove friend:', error);
        toast({
          title: 'Failed to remove friend',
          description: 'Please try again later.',
          variant: 'destructive',
        });
        throw error;
      }
    },
    [removeMutation, toast]
  );

  return {
    removeFriend,
    isLoading: false, // Convex mutations don't provide loading state
  };
};
import { useMutation } from 'convex/react';
import { useToast } from '@/hooks/use-toast';
import { api, type Id } from '@/lib/convex';
import type { UserId } from '../types';

/**
 * Hook to send a friend request to another user.
 *
 * Uses Convex's sendFriendRequest mutation to create a new friend request.
 * Provides loading state and error handling with toast notifications.
 *
 * @returns Object containing sendFriendRequest function and loading state
 *
 * @example
 * ```tsx
 * const { sendFriendRequest, isLoading } = useSendFriendRequest();
 *
 * const handleSendRequest = async (userId: UserId) => {
 *   try {
 *     await sendFriendRequest({ friendId: userId });
 *     // Request sent successfully
 *   } catch (error) {
 *     // Error handled by hook
 *   }
 * };
 * ```
 */
export const useSendFriendRequest = () => {
  const { toast } = useToast();
  const sendRequestMutation = useMutation(api.friends.sendFriendRequest);

  const sendFriendRequest = async ({
    friendId,
    message,
  }: {
    friendId: UserId;
    message?: string;
  }) => {
    try {
      await sendRequestMutation({ friendId: friendId as Id<'users'>, message });

      toast({
        title: 'Friend request sent',
        description: 'Your friend request has been sent successfully.',
      });
    } catch (error) {
      console.error('Failed to send friend request:', error);

      toast({
        title: 'Failed to send friend request',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });

      throw error;
    }
  };

  return {
    sendFriendRequest,
    isLoading: false, // Convex mutations don't provide loading state directly
  };
};
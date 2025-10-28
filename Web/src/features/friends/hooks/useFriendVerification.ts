import { useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';

interface UseFriendVerificationReturn {
  verifyFriendship: (username: string) => Promise<boolean>;
  isVerifying: boolean;
}

/**
 * Hook for friend verification logic.
 * Provides functions to verify if a user is friends with another user by username.
 */
export const useFriendVerification = (): UseFriendVerificationReturn => {
  const { toast } = useToast();

  const currentUser = useQuery(api.users.getCurrentUser);
  const friendsListQuery = useQuery(api.friends.getFriendsList);

  const verifyFriendship = useCallback(
    async (username: string): Promise<boolean> => {
      try {
        if (!username || username.trim().length === 0) {
          toast({
            title: 'Invalid username',
            description: 'Username cannot be empty',
            variant: 'destructive',
          });
          return false;
        }

        const trimmedUsername = username.trim();

        // Check friendship using the checkFriendship query
        if (!currentUser) {
          toast({
            title: 'Authentication required',
            description: 'Please log in to verify friendships',
            variant: 'destructive',
          });
          return false;
        }

        // Use a different approach - check if the user exists in friends list
        // This avoids calling useQuery inside a callback
        const currentFriendsList = friendsListQuery || [];
        const isFriend = currentFriendsList.some(friend => friend.username === trimmedUsername);

        if (!isFriend) {
          toast({
            title: 'Not friends',
            description: `You are not friends with ${trimmedUsername}`,
            variant: 'destructive',
          });
          return false;
        }

        return true;
      } catch (error) {
        console.error('Friend verification error:', error);
        toast({
          title: 'Verification error',
          description: 'Failed to verify friendship',
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast, currentUser, friendsListQuery]
  );

  return {
    verifyFriendship,
    isVerifying: false,
  };
};
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { api, type Id } from '@/lib/convex';
import type { UserId } from '../types';

export const useSendFriendRequest = () => {
  const { toast } = useToast();
  const sendRequestMutation = useMutation(api.friends.sendFriendRequest);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendFriendRequest = async ({
    friendId,
    message,
  }: {
    friendId: UserId;
    message?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await sendRequestMutation({ friendId: friendId as Id<'users'>, message });

      toast({
        title: 'Friend request sent',
        description: 'Your friend request has been sent successfully.',
      });
    } catch (err) {
      console.error('Failed to send friend request:', err);
      
      const errorObj = err instanceof Error ? err : new Error('An unexpected error occurred.');
      setError(errorObj);

      toast({
        title: 'Failed to send friend request',
        description: err instanceof Error ? err.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendFriendRequest,
    isLoading,
    error,
  };
};
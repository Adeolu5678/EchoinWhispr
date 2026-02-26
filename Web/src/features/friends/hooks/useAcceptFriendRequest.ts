import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import { Id } from '@/lib/convex';

export const useAcceptFriendRequest = () => {
  const { toast } = useToast();
  const acceptMutation = useMutation(api.friends.acceptFriendRequest);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const acceptFriendRequest = async (requestId: Id<'friends'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await acceptMutation({ requestId });
      toast({
        title: 'Friend request accepted',
        description: 'You are now friends!',
      });
    } catch (err) {
      console.error('Failed to accept friend request:', err);
      
      const errorObj = err instanceof Error ? err : new Error('Please try again later.');
      setError(errorObj);
      
      toast({
        title: 'Failed to accept friend request',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    acceptFriendRequest,
    isLoading,
    error,
  };
};
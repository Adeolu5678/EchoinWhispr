import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import type { Id } from '@/lib/convex';

export const useRejectFriendRequest = () => {
  const { toast } = useToast();
  const rejectMutation = useMutation(api.friends.rejectFriendRequest);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const rejectFriendRequest = async (requestId: Id<'friends'>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await rejectMutation({ requestId });
      toast({
        title: 'Friend request rejected',
        description: 'The request has been declined.',
      });
    } catch (err) {
      console.error('Failed to reject friend request:', err);
      
      const errorObj = err instanceof Error ? err : new Error('Please try again later.');
      setError(errorObj);
      
      toast({
        title: 'Failed to reject friend request',
        description: 'Please try again later.',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    rejectFriendRequest,
    isLoading,
    error,
  };
};
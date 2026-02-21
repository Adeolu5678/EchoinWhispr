import { useQuery } from 'convex/react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/convex';

export const useGetConversations = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const conversations = useQuery(api.conversations.getActiveConversations, { 
    paginationOpts: { numItems: 200, cursor: null } 
  });

  useEffect(() => {
    if (conversations instanceof Error) {
      setError(conversations);
    } else if (conversations !== undefined) {
      setError(null);
    }
  }, [conversations]);

  return {
    conversations: conversations || [],
    isLoading: conversations === undefined,
    error,
  };
};

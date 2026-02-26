import { useQuery } from 'convex/react';
import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { api } from '@/lib/convex';
import type { Friend } from '../types';

export const useFriends = () => {
  const [error, setError] = useState<Error | null>(null);
  const { isSignedIn } = useAuth();
  
  const friendsData = useQuery(
    api.friends.getFriendsList,
    isSignedIn ? {} : 'skip'
  );

  const friendsList = friendsData?.friends ?? [];
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const friends: Friend[] = friendsList.map((friendData: any) => ({
    _id: friendData._id,
    username: friendData.username,
    firstName: friendData.firstName,
    lastName: friendData.lastName,
    avatarUrl: friendData.avatarUrl,
    friendshipId: friendData.friendshipId,
  }));

  useEffect(() => {
    if (friendsData instanceof Error) {
      setError(friendsData);
    } else if (friendsData !== undefined) {
      setError(null);
    }
  }, [friendsData]);

  return {
    friends,
    isLoading: friendsData === undefined,
    error,
    totalCount: friendsData?.totalCount ?? 0,
    hasMore: friendsData?.hasMore ?? false,
  };
};

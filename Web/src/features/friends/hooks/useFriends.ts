import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import type { Friend } from '../types';

/**
 * Hook to fetch the current user's friends list.
 *
 * Uses Convex's getFriendsList query to retrieve accepted friendships
 * with user details. Returns an array of Friend objects containing
 * user information and friendship metadata.
 *
 * @returns Object containing friends array and loading state
 *
 * @example
 * ```tsx
 * const { friends, isLoading } = useFriends();
 *
 * if (isLoading) return <div>Loading friends...</div>;
 *
 * return (
 *   <div>
 *     {friends.map(friend => (
 *       <FriendCard key={friend._id} friend={friend} />
 *     ))}
 *   </div>
 * );
 * ```
 */
export const useFriends = () => {
  // Fetch friends list from Convex (returns { friends, totalCount, hasMore })
  const friendsData = useQuery(api.friends.getFriendsList, {});

  // Transform the data to match our Friend type
  // Note: getFriendsList returns an object with a friends array
  const friendsList = friendsData?.friends ?? [];
  
  const friends: Friend[] = friendsList.map(friendData => ({
    _id: friendData._id,
    username: friendData.username,
    firstName: friendData.firstName,
    lastName: friendData.lastName,
    avatarUrl: friendData.avatarUrl,
    friendshipId: friendData.friendshipId,
  }));

  return {
    friends,
    isLoading: friendsData === undefined,
    totalCount: friendsData?.totalCount ?? 0,
    hasMore: friendsData?.hasMore ?? false,
  };
};

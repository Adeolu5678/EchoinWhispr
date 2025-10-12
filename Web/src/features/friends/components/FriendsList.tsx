'use client';

import { Users } from 'lucide-react';
import { FriendCard } from './FriendCard';
import type { FriendListProps } from '../types';

/**
 * FriendsList component displays a list of friends with loading and empty states.
 *
 * Shows a scrollable list of FriendCard components, handles loading states,
 * and displays appropriate empty state messages. Uses responsive design
 * and proper spacing.
 *
 * @param friends - Array of friend data to display
 * @param onRemoveFriend - Callback function to handle friend removal
 * @param isLoading - Loading state for the friends list
 */
export const FriendsList = ({ friends, onRemoveFriend, isLoading }: FriendListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No friends yet</h3>
        <p className="text-gray-500 max-w-sm">
          Start connecting with others by sending friend requests. Your friends will appear here once they accept.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {friends.map((friend) => (
        <FriendCard
          key={friend.friendshipId}
          friend={friend}
          onRemove={onRemoveFriend}
          isRemoving={false} // TODO: Implement individual loading states if needed
        />
      ))}
    </div>
  );
};
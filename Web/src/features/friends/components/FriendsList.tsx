'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Users } from 'lucide-react';
import { FriendCard } from './FriendCard';
import { FriendListSkeleton } from '@/components/ui/skeletons';
import type { FriendListProps } from '../types';

/**
 * FriendsList component displays a list of friends with loading and empty states.
 *
 * Shows a scrollable list of FriendCard components, handles loading states,
 * and displays appropriate empty state messages. Uses responsive design
 * and proper spacing. Features staggered entrance animations.
 *
 * @param friends - Array of friend data to display
 * @param onRemoveFriend - Callback function to handle friend removal
 * @param isLoading - Loading state for the friends list
 */
export const FriendsList = ({ friends, onRemoveFriend, isLoading }: FriendListProps) => {
  if (isLoading) {
    return (
      <div role="status" aria-label="Loading friends">
        <FriendListSkeleton count={3} />
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <motion.div 
        className="flex flex-col items-center justify-center py-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No friends yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Start connecting with others by sending friend requests. Your friends will appear here once they accept.
        </p>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div 
        className="space-y-3 max-h-96 overflow-y-auto"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.06,
            },
          },
        }}
      >
        {friends.map((friend) => (
          <motion.div
            key={friend.friendshipId}
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, 
                x: 0, 
                transition: { 
                  duration: 0.3, 
                  ease: [0.25, 0.1, 0.25, 1] 
                } 
              },
            }}
            exit={{ opacity: 0, x: 20 }}
          >
            <FriendCard
              friend={friend}
              onRemove={onRemoveFriend}
              isRemoving={false}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};
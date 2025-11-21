'use client';

import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { FriendCardProps } from '../types';

/**
 * FriendCard component displays a single friend with their information and actions.
 *
 * Shows friend's avatar, username, display name, and provides a remove friend button.
 * Uses Shadcn UI components for consistent styling and accessibility.
 *
 * @param friend - The friend data to display
 * @param onRemove - Callback function to handle friend removal
 * @param isRemoving - Loading state for the remove action
 */
export const FriendCard = ({ friend, onRemove, isRemoving }: FriendCardProps) => {
  const displayName = friend.firstName && friend.lastName
    ? `${friend.firstName} ${friend.lastName}`
    : friend.username;

  const handleRemove = () => {
    onRemove(friend.friendshipId);
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={friend.avatarUrl} alt={displayName} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{displayName}</span>
            {friend.firstName && friend.lastName && (
              <span className="text-xs text-muted-foreground">@{friend.username}</span>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemove}
          disabled={isRemoving}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          {isRemoving ? 'Removing...' : 'Remove'}
        </Button>
      </CardContent>
    </Card>
  );
};
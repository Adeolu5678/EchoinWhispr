'use client';

import { useState } from 'react';
import { User, MessageCircle } from 'lucide-react';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FriendWhisperComposer } from './FriendWhisperComposer';
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
  const [isWhisperModalOpen, setIsWhisperModalOpen] = useState(false);
  const displayName = friend.firstName && friend.lastName
    ? `${friend.firstName} ${friend.lastName}`
    : friend.username;

  const handleRemove = () => {
    onRemove(friend.friendshipId);
  };

  const handleWhisperSent = () => {
    setIsWhisperModalOpen(false);
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
        <div className="flex gap-2">
          {FEATURE_FLAGS.ENHANCED_FRIEND_WHISPERING && (
            <Dialog open={isWhisperModalOpen} onOpenChange={setIsWhisperModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Whisper
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Send a Whisper to {displayName}</DialogTitle>
                </DialogHeader>
                <FriendWhisperComposer
                  friendUsername={friend.username}
                  onWhisperSent={handleWhisperSent}
                  placeholder={`Send a private whisper to ${displayName}...`}
                />
              </DialogContent>
            </Dialog>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
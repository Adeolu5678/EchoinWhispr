'use client';

import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { FriendRequestCardProps } from '../types';

/**
 * FriendRequestCard component displays a friend request with sender information and actions.
 *
 * Shows the sender's avatar, username, display name, and provides Accept/Reject buttons
 * for incoming requests. Uses Shadcn UI components for consistent styling and accessibility.
 *
 * @param request - The friend request data to display
 * @param onAccept - Callback function to handle request acceptance
 * @param onReject - Callback function to handle request rejection
 * @param isAccepting - Loading state for the accept action
 * @param isRejecting - Loading state for the reject action
 */
export const FriendRequestCard = ({
  request,
  onAccept,
  onReject,
  isAccepting,
  isRejecting
}: FriendRequestCardProps) => {
  const displayName = request.sender?.firstName && request.sender?.lastName
    ? `${request.sender.firstName} ${request.sender.lastName}`
    : request.sender?.username || 'Unknown User';

  const handleAccept = () => {
    onAccept(request.friendshipId);
  };

  const handleReject = () => {
    onReject(request.friendshipId);
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={request.sender?.avatarUrl} alt={displayName} />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{displayName}</span>
            {request.sender?.firstName && request.sender?.lastName && (
              <span className="text-xs text-muted-foreground">@{request.sender?.username}</span>
            )}
            {request.message && (
              <span className="text-xs text-muted-foreground italic">&quot;{request.message}&quot;</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            disabled={isRejecting || isAccepting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAccept}
            disabled={isAccepting || isRejecting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isAccepting ? 'Accepting...' : 'Accept'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui';
import { MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { Id } from '@/lib/convex';

/**
 * ConversationCard component displays a conversation with the other participant.
 * Shows last message, timestamp, and unread count.
 *
 * @param conversation - The conversation data
 * @param currentUserId - The ID of the current user
 */
interface ConversationCardProps {
  conversation: {
    _id: Id<'conversations'>;
    participantIds: Id<'users'>[];
    status: 'initiated' | 'active' | 'closed';
    updatedAt: number;
    // Add lastMessage when messages are implemented
    // lastMessage?: {
    //   content: string;
    //   senderId: Id<'users'>;
    //   createdAt: number;
    // };
    // unreadCount?: number;
  };
  currentUserId: Id<'users'>;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  currentUserId,
}) => {
  // Find the other participant ID
  const otherParticipantId = conversation.participantIds.find(
    (id) => id !== currentUserId
  );

  if (!otherParticipantId) {
    return null; // Should not happen, but safety check
  }

  // For MVP, show placeholder name based on ID
  const displayName = `User ${otherParticipantId.slice(-4)}`;

  // Feature-flagged conversation naming using whisper content preview
  const conversationName = FEATURE_FLAGS.CONVERSATION_EVOLUTION && conversation.initialWhisperId
    ? `${conversation.initialWhisperId.slice(-4)}...` // Placeholder for first 3 words + "..."
    : displayName;

  const statusColor = {
    initiated: 'bg-yellow-100 text-yellow-800',
    active: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800',
  }[conversation.status];

  return (
    <Link href={`/conversations/${conversation._id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold truncate">
              {displayName}
            </CardTitle>
            <Badge variant="secondary" className={statusColor}>
              {conversation.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-4 w-4" />
              <span>
                {/* Placeholder for last message preview */}
                Conversation started
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          {/* Placeholder for unread count */}
          {/* {conversation.unreadCount && conversation.unreadCount > 0 && (
            <Badge variant="destructive" className="mt-2">
              {conversation.unreadCount} unread
            </Badge>
          )} */}
        </CardContent>
      </Card>
    </Link>
  );
};
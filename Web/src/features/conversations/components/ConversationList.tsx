'use client';

import { ConversationCard } from './ConversationCard';
import { useGetConversations } from '../hooks/useGetConversations';
import { useUser } from '@clerk/nextjs';
import { Loader2, MessageCircle } from 'lucide-react';
import type { Id } from '@/lib/convex';

/**
 * ConversationList component displays a list of conversations.
 * Handles empty state, loading state, and scrolling.
 */
export const ConversationList: React.FC = () => {
  const { conversations, isLoading, error } = useGetConversations();
  const { user } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading conversations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          Failed to load conversations
        </h3>
        <p className="text-sm text-muted-foreground">
          {error || 'An error occurred while loading your conversations.'}
        </p>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">
          No conversations yet
        </h3>
        <p className="text-sm text-muted-foreground">
          When you send or receive echo requests that are accepted, your conversations will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation._id}
          conversation={conversation}
          currentUserId={user?.id as Id<'users'>}
        />
      ))}
    </div>
  );
};
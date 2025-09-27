import type { Id } from 'convex/values';

/**
 * Type definitions for the Conversation Evolution feature.
 *
 * This feature allows whispers to evolve into two-way conversations where both parties'
 * identities are revealed. This is a deferred feature controlled by CONVERSATION_EVOLUTION flag.
 */

/**
 * Represents the status of a conversation.
 */
export type ConversationStatus = 'initiated' | 'active' | 'closed';

/**
 * Represents an echo request for identity reveal.
 * Using string types for MVP foundation since Id types are generated.
 */
export interface EchoRequest {
  _id: Id<"echoRequests">;
  conversationId: Id<"conversations">;
  requesterId: Id<"users">;
  targetId: Id<"users">;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: number;
  respondedAt?: number;
}

/**
 * Props for the EchoBackButton component.
 */
export interface EchoBackButtonProps {
  whisperId: string;
  onEchoBack?: () => void;
}

/**
 * Props for the EchoRequestCard component.
 */
export interface EchoRequestCardProps {
  request: EchoRequest;
  onAccept?: () => void;
  onReject?: () => void;
}

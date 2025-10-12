import type { GenericId } from 'convex/values';

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
 * Represents a conversation between two users.
 */
export interface Conversation {
  _id: GenericId<"conversations">;
  participantIds: GenericId<"users">[];
  participantKey: string;
  initialWhisperId: GenericId<"whispers">;
  status: ConversationStatus;
  createdAt: number;
  updatedAt: number;
}

/**
 * Represents a message in a conversation.
 */
export interface Message {
  _id: GenericId<"messages">;
  conversationId: GenericId<"conversations">;
  senderId: GenericId<"users">;
  content: string;
  createdAt: number;
}

/**
 * Represents an echo request for identity reveal.
 * Using string types for MVP foundation since Id types are generated.
 */
export interface EchoRequest {
  _id: GenericId<"echoRequests">;
  conversationId: GenericId<"conversations">;
  requesterId: GenericId<"users">;
  targetId: GenericId<"users">;
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

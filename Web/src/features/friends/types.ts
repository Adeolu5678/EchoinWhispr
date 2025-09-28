/**
 * TypeScript types for the Friends feature.
 * Defines interfaces for friend-related data structures used throughout the application.
 */

import type { UserSearchResult } from '../../types/user';

// Using string types for MVP foundation since Id types are generated.
export type FriendId = string;
export type UserId = string;

/**
 * Represents a user in the context of friends functionality.
 * Contains basic user information needed for friend operations.
 */
export interface FriendUser {
  _id: UserId;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  friendshipId?: FriendId; // For removal operations
}

/**
 * Represents a friend request with sender information.
 */
export interface FriendRequest {
  _id: FriendId;
  userId: UserId; // Sender
  friendId: UserId; // Recipient
  status: "pending" | "accepted" | "blocked";
  createdAt: number;
  updatedAt: number;
  sender?: FriendUser; // Populated by query
}

/**
 * Represents a sent friend request with recipient information.
 */
export interface SentFriendRequest {
  _id: FriendId;
  userId: UserId; // Sender
  friendId: UserId; // Recipient
  status: "pending" | "accepted" | "blocked";
  createdAt: number;
  updatedAt: number;
  recipient?: FriendUser; // Populated by query
}

/**
 * Props for the FriendCard component.
 */
export interface FriendCardProps {
  friend: FriendUser;
  onRemove: (friendshipId: FriendId) => void;
  isRemoving?: boolean;
}

/**
 * Props for the FriendRequestCard component.
 */
export interface FriendRequestCardProps {
  request: FriendRequest;
  onAccept: (requestId: FriendId) => void;
  onReject: (requestId: FriendId) => void;
  isAccepting?: boolean;
  isRejecting?: boolean;
}

/**
 * Props for the UserSearchResult component.
 */
export interface UserSearchResultProps {
  user: UserSearchResult;
  onSendRequest: (userId: UserId) => void;
  isSending?: boolean;
  canSendRequest?: boolean;
}

/**
 * Props for the FriendList component.
 */
export interface FriendListProps {
  friends: FriendUser[];
  onRemoveFriend: (friendshipId: FriendId) => void;
  isLoading?: boolean;
}

/**
 * Props for the UserSearch component.
 */
export interface UserSearchProps {
  onSendRequest: (userId: UserId) => void;
  isSendingRequest?: boolean;
}
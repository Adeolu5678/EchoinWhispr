/**
 * TypeScript types for the Friends feature.
 * Defines interfaces for friend-related data structures used throughout the application.
 */

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
  avatarUrl?: string;
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
  message?: string;
  sender?: FriendUser; // Populated by query
  friendshipId: FriendId; // Alias for _id for consistency
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
  message?: string;
  recipient?: FriendUser; // Populated by query
  friendshipId: FriendId; // Alias for _id for consistency
}

/**
 * Represents a friend with user details and friendship information.
 */
export interface Friend {
  _id: UserId;
  username: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  friendshipId: FriendId; // ID of the friendship record for removal
}

/**
 * Search result for user search functionality.
 */
export interface UserSearchResult {
  _id: UserId;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Props for the FriendCard component.
 */
export interface FriendCardProps {
  friend: Friend;
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
 * Props for the SentFriendRequestCard component.
 */
export interface SentFriendRequestCardProps {
  request: SentFriendRequest;
  onCancel: (requestId: FriendId) => void;
  isCancelling?: boolean;
}

/**
 * Props for the FriendsList component.
 */
export interface FriendListProps {
  friends: Friend[];
  onRemoveFriend: (friendshipId: FriendId) => void;
  isLoading?: boolean;
}

/**
 * Props for the FriendRequestsList component.
 */
export interface FriendRequestsListProps {
  requests: FriendRequest[];
  onAcceptRequest: (requestId: FriendId) => void;
  onRejectRequest: (requestId: FriendId) => void;
  isLoading?: boolean;
}

/**
 * Props for the SentRequestsList component.
 */
export interface SentRequestsListProps {
  requests: SentFriendRequest[];
  onCancelRequest: (requestId: FriendId) => void;
  isLoading?: boolean;
}

/**
 * Props for the UserSearch component.
 */
export interface UserSearchProps {
  onSendRequest: (userId: UserId) => void;
  isSendingRequest?: boolean;
}
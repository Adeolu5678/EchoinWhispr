/**
 * Whisper-related type definitions for the Web application
 * These types define the structure of whisper data and API responses
 */

// Base whisper data structure from Convex schema
export interface Whisper {
  _id: string;
  _creationTime: number;
  senderId: string;
  recipientId: string;
  content: string;
  isRead: boolean;
  createdAt: number;
  readAt?: number;
  conversationId?: string; // Future feature: links to conversation if whisper evolved
  imageUrl?: string; // Optional image attachment for the whisper
  location?: { latitude: number; longitude: number }; // Optional location data for the whisper
  audioStorageId?: string; // Optional audio attachment
  audioDuration?: number; // Duration of audio in seconds
}

// Extended whisper with additional computed fields for UI display
export interface WhisperWithSender extends Whisper {
  senderName?: string;
  senderAvatar?: string;
  isOwnWhisper: boolean;
  formattedTime: string;
  relativeTime: string;
}

// API response types for whisper operations
export interface SendWhisperRequest {
  recipientUsername: string;
  imageUrl?: string;
  content: string;
  location?: { latitude: number; longitude: number };
}

export interface SendWhisperToUserRequest {
  recipientUsername: string;
  content: string;
}

export interface SendWhisperResponse {
  success: boolean;
  whisperId: string;
  error?: string;
}

// Hook return types for better type safety

// Constants for whisper operations
export const WHISPER_LIMITS = {
  MAX_CONTENT_LENGTH: 280,
  MIN_CONTENT_LENGTH: 1,
} as const;

export const WHISPER_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed',
} as const;

export type WhisperStatus =
  (typeof WHISPER_STATUS)[keyof typeof WHISPER_STATUS];

/**
 * Whisper-related type definitions for the Web application
 * These types define the structure of whisper data and API responses
 */

// Base whisper data structure from Convex schema
export interface Whisper {
  _id: string
  _creationTime: number
  senderId: string
  recipientId: string
  content: string
  isRead: boolean
  createdAt: number
  readAt?: number
  conversationId?: string // Future feature: links to conversation if whisper evolved
}

// Extended whisper with additional computed fields for UI display
export interface WhisperWithSender extends Whisper {
  senderName?: string
  senderAvatar?: string
  isOwnWhisper: boolean
  formattedTime: string
  relativeTime: string
}

// API response types for whisper operations
export interface SendWhisperRequest {
  recipientUsername: string
  content: string
}

export interface SendWhisperToUserRequest {
  recipientUsername: string
  content: string
}

export interface SendWhisperResponse {
  success: boolean
  whisperId: string
  error?: string
}

// Hook return types for better type safety
export interface UseWhispersReturn {
  whispers: WhisperWithSender[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export interface UseSendWhisperReturn {
  sendWhisper: (request: SendWhisperRequest) => Promise<SendWhisperResponse>
  isLoading: boolean
  error: string | null
}

export interface UseMarkAsReadReturn {
  markAsRead: (whisperId: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

// Error types for whisper operations
export interface WhisperError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// Constants for whisper operations
export const WHISPER_LIMITS = {
  MAX_CONTENT_LENGTH: 280,
  MIN_CONTENT_LENGTH: 1,
} as const

export const WHISPER_STATUS = {
  UNREAD: 'unread',
  READ: 'read',
  SENDING: 'sending',
  SENT: 'sent',
  FAILED: 'failed',
} as const

export type WhisperStatus = typeof WHISPER_STATUS[keyof typeof WHISPER_STATUS]
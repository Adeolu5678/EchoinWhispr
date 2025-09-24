/**
 * Error handling utilities for the Web application
 * Provides consistent error types and user-friendly error messages
 */

import { WhisperError } from '../features/whispers/types'

// Error codes for different types of failures
export const ERROR_CODES = {
  // Network and connectivity errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',

  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',

  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  CONTENT_TOO_LONG: 'CONTENT_TOO_LONG',
  CONTENT_TOO_SHORT: 'CONTENT_TOO_SHORT',

  // Whisper-specific errors
  WHISPER_NOT_FOUND: 'WHISPER_NOT_FOUND',
  CANNOT_SEND_TO_SELF: 'CANNOT_SEND_TO_SELF',
  RECIPIENT_NOT_FOUND: 'RECIPIENT_NOT_FOUND',
  WHISPER_SEND_FAILED: 'WHISPER_SEND_FAILED',
  WHISPER_MARK_READ_FAILED: 'WHISPER_MARK_READ_FAILED',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  RETRY_FAILED: 'RETRY_FAILED',
} as const

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES]

// User-friendly error messages mapped to error codes
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.NETWORK_ERROR]: 'Network connection failed. Please check your internet connection and try again.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error occurred. Please try again later.',

  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ERROR_CODES.FORBIDDEN]: 'Access denied. You do not have permission to perform this action.',
  [ERROR_CODES.TOKEN_EXPIRED]: 'Your session has expired. Please sign in again.',

  [ERROR_CODES.VALIDATION_ERROR]: 'Invalid input provided. Please check your data and try again.',
  [ERROR_CODES.INVALID_INPUT]: 'Invalid input provided. Please check your data and try again.',
  [ERROR_CODES.CONTENT_TOO_LONG]: 'Message is too long. Please keep it under 280 characters.',
  [ERROR_CODES.CONTENT_TOO_SHORT]: 'Message is too short. Please add some content.',

  [ERROR_CODES.WHISPER_NOT_FOUND]: 'Whisper not found.',
  [ERROR_CODES.CANNOT_SEND_TO_SELF]: 'You cannot send a whisper to yourself.',
  [ERROR_CODES.RECIPIENT_NOT_FOUND]: 'Recipient not found.',
  [ERROR_CODES.WHISPER_SEND_FAILED]: 'Failed to send whisper. Please try again.',
  [ERROR_CODES.WHISPER_MARK_READ_FAILED]: 'Failed to mark whisper as read. Please try again.',

  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.RETRY_FAILED]: 'Operation failed after multiple attempts. Please try again later.',
}

/**
 * Creates a standardized error object with user-friendly message
 * @param code - The error code
 * @param originalError - The original error object (optional)
 * @param customMessage - Custom error message to override default (optional)
 * @returns WhisperError object
 */
export function createWhisperError(
  code: ErrorCode,
  originalError?: unknown,
  customMessage?: string
): WhisperError {
  const message = customMessage || ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]

  const error: WhisperError = {
    code,
    message,
    details: originalError ? { originalError: String(originalError) } : undefined,
  }

  // Log error for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.error('WhisperError:', error, originalError)
  }

  return error
}

/**
 * Maps HTTP status codes to error codes
 * @param status - HTTP status code
 * @returns Corresponding error code
 */
export function mapHttpStatusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ERROR_CODES.VALIDATION_ERROR
    case 401:
      return ERROR_CODES.UNAUTHORIZED
    case 403:
      return ERROR_CODES.FORBIDDEN
    case 404:
      return ERROR_CODES.WHISPER_NOT_FOUND
    case 408:
    case 504:
      return ERROR_CODES.TIMEOUT_ERROR
    case 500:
    case 502:
    case 503:
      return ERROR_CODES.SERVER_ERROR
    default:
      return ERROR_CODES.UNKNOWN_ERROR
  }
}

/**
 * Maps Convex errors to standardized error codes
 * @param error - Convex error object
 * @returns Corresponding error code
 */
export function mapConvexErrorToErrorCode(error: unknown): ErrorCode {
  const errorString = String(error).toLowerCase()

  if (errorString.includes('network') || errorString.includes('fetch')) {
    return ERROR_CODES.NETWORK_ERROR
  }

  if (errorString.includes('timeout')) {
    return ERROR_CODES.TIMEOUT_ERROR
  }

  if (errorString.includes('unauthorized') || errorString.includes('auth')) {
    return ERROR_CODES.UNAUTHORIZED
  }

  if (errorString.includes('forbidden')) {
    return ERROR_CODES.FORBIDDEN
  }

  if (errorString.includes('validation') || errorString.includes('invalid')) {
    return ERROR_CODES.VALIDATION_ERROR
  }

  return ERROR_CODES.UNKNOWN_ERROR
}

/**
 * Determines if an error is retryable
 * @param error - The error to check
 * @returns True if the error can be retried
 */
export function isRetryableError(error: WhisperError): boolean {
  const retryableCodes: ErrorCode[] = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.SERVER_ERROR,
    ERROR_CODES.RETRY_FAILED,
  ]

  return retryableCodes.includes(error.code as ErrorCode)
}

/**
 * Creates a retry function with exponential backoff
 * @param fn - The function to retry
 * @param maxAttempts - Maximum number of retry attempts
 * @param baseDelay - Base delay in milliseconds
 * @returns Promise that resolves when retry succeeds or fails permanently
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      if (attempt === maxAttempts) {
        break
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  throw createWhisperError(ERROR_CODES.RETRY_FAILED, lastError)
}

/**
 * Validates whisper content length
 * @param content - The whisper content to validate
 * @returns True if content length is valid
 */
export function validateWhisperContent(content: string): boolean {
  const trimmedContent = content.trim()

  if (trimmedContent.length < 1) {
    throw createWhisperError(ERROR_CODES.CONTENT_TOO_SHORT)
  }

  if (trimmedContent.length > 280) {
    throw createWhisperError(ERROR_CODES.CONTENT_TOO_LONG)
  }

  return true
}
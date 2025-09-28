/**
 * Error handling utilities for the Web application
 * Provides consistent error types and user-friendly error messages
 */

// Error interface for application-wide errors
export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

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

  // User errors
  USER_NOT_FOUND: 'USER_NOT_FOUND',

  // Generic errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  RETRY_FAILED: 'RETRY_FAILED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// User-friendly error messages mapped to error codes
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ERROR_CODES.NETWORK_ERROR]:
    'Network connection failed. Please check your internet connection and try again.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_CODES.SERVER_ERROR]: 'Server error occurred. Please try again later.',

  [ERROR_CODES.UNAUTHORIZED]: 'You are not authorized to perform this action.',
  [ERROR_CODES.FORBIDDEN]:
    'Access denied. You do not have permission to perform this action.',
  [ERROR_CODES.TOKEN_EXPIRED]:
    'Your session has expired. Please sign in again.',

  [ERROR_CODES.VALIDATION_ERROR]:
    'Invalid input provided. Please check your data and try again.',
  [ERROR_CODES.INVALID_INPUT]:
    'Invalid input provided. Please check your data and try again.',
  [ERROR_CODES.CONTENT_TOO_LONG]:
    'Message is too long. Please keep it under 280 characters.',
  [ERROR_CODES.CONTENT_TOO_SHORT]:
    'Message is too short. Please add some content.',

  [ERROR_CODES.WHISPER_NOT_FOUND]: 'Whisper not found.',
  [ERROR_CODES.CANNOT_SEND_TO_SELF]: 'You cannot send a whisper to yourself.',
  [ERROR_CODES.RECIPIENT_NOT_FOUND]: 'Recipient not found.',
  [ERROR_CODES.WHISPER_SEND_FAILED]:
    'Failed to send whisper. Please try again.',
  [ERROR_CODES.WHISPER_MARK_READ_FAILED]:
    'Failed to mark whisper as read. Please try again.',

  [ERROR_CODES.USER_NOT_FOUND]: 'User not found.',

  [ERROR_CODES.UNKNOWN_ERROR]:
    'An unexpected error occurred. Please try again.',
  [ERROR_CODES.RETRY_FAILED]:
    'Operation failed after multiple attempts. Please try again later.',
};

/**
 * Create a standardized AppError containing a user-facing message and optional original error details.
 *
 * @param code - The canonical error code to classify the error
 * @param originalError - Optional original error or value; when provided its string form is included in `details.originalError`
 * @param customMessage - Optional message to override the default user-facing message for the given code
 * @returns The constructed AppError with `code`, `message`, and optional `details` containing the original error string
 */
export function createAppError(
  code: ErrorCode,
  originalError?: unknown,
  customMessage?: string
): AppError {
  const message =
    customMessage ||
    ERROR_MESSAGES[code] ||
    ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];

  const error: AppError = {
    code,
    message,
    details: originalError
      ? { originalError: String(originalError) }
      : undefined,
  };

  // Log error for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.error('AppError:', error, originalError);
  }

  return error;
}

/**
 * Map an HTTP status code to a standardized ErrorCode.
 *
 * @param status - The HTTP status code to map.
 * @returns The corresponding ErrorCode; `UNKNOWN_ERROR` when there is no specific mapping.
 */
export function mapHttpStatusToErrorCode(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ERROR_CODES.VALIDATION_ERROR;
    case 401:
      return ERROR_CODES.UNAUTHORIZED;
    case 403:
      return ERROR_CODES.FORBIDDEN;
    case 404:
      return ERROR_CODES.WHISPER_NOT_FOUND;
    case 408:
    case 504:
      return ERROR_CODES.TIMEOUT_ERROR;
    case 500:
    case 502:
    case 503:
      return ERROR_CODES.SERVER_ERROR;
    default:
      return ERROR_CODES.UNKNOWN_ERROR;
  }
}

/**
 * Derives a standardized ErrorCode from a Convex error value.
 *
 * Inspects the string representation of `error` and maps common keywords to an appropriate ErrorCode.
 *
 * @param error - The Convex error value whose string form will be inspected for keywords
 * @returns `NETWORK_ERROR` if the text includes "network" or "fetch", `TIMEOUT_ERROR` if it includes "timeout", `UNAUTHORIZED` if it includes "unauthorized" or "auth", `FORBIDDEN` if it includes "forbidden", `VALIDATION_ERROR` if it includes "validation" or "invalid", `UNKNOWN_ERROR` otherwise
 */
export function mapConvexErrorToErrorCode(error: unknown): ErrorCode {
  const errorString = String(error).toLowerCase();

  if (errorString.includes('network') || errorString.includes('fetch')) {
    return ERROR_CODES.NETWORK_ERROR;
  }

  if (errorString.includes('timeout')) {
    return ERROR_CODES.TIMEOUT_ERROR;
  }

  if (errorString.includes('unauthorized') || errorString.includes('auth')) {
    return ERROR_CODES.UNAUTHORIZED;
  }

  if (errorString.includes('forbidden')) {
    return ERROR_CODES.FORBIDDEN;
  }

  if (errorString.includes('validation') || errorString.includes('invalid')) {
    return ERROR_CODES.VALIDATION_ERROR;
  }

  return ERROR_CODES.UNKNOWN_ERROR;
}

/**
 * Checks whether an AppError's code indicates the error is retryable.
 *
 * @param error - The AppError to evaluate
 * @returns `true` if the error's code indicates it is retryable, `false` otherwise.
 */
export function isRetryableError(error: AppError): boolean {
  const retryableCodes: ErrorCode[] = [
    ERROR_CODES.NETWORK_ERROR,
    ERROR_CODES.TIMEOUT_ERROR,
    ERROR_CODES.SERVER_ERROR,
    ERROR_CODES.RETRY_FAILED,
  ];

  return retryableCodes.includes(error.code as ErrorCode);
}

/**
 * Retries an asynchronous operation with exponential backoff and jitter until it succeeds or the maximum attempts are exhausted.
 *
 * @param fn - The asynchronous operation to execute
 * @param maxAttempts - Maximum number of attempts to try the operation (default: 3)
 * @param baseDelay - Initial delay in milliseconds used for exponential backoff (default: 1000)
 * @returns The resolved value from a successful `fn` invocation
 * @throws AppError with code `RETRY_FAILED` when all attempts fail; the error's `details` includes the last encountered error
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxAttempts) {
        break;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw createAppError(ERROR_CODES.RETRY_FAILED, lastError);
}

/**
 * Validate whisper content length and throw a standardized AppError on violation.
 *
 * Leading and trailing whitespace are trimmed before validation.
 *
 * @param content - The whisper text to validate; whitespace at both ends is ignored.
 * @returns `true` if the trimmed content length is between 1 and 280 characters inclusive.
 * @throws AppError with code `CONTENT_TOO_SHORT` if the trimmed content is empty.
 * @throws AppError with code `CONTENT_TOO_LONG` if the trimmed content exceeds 280 characters.
 */
export function validateWhisperContent(content: string): boolean {
  const trimmedContent = content.trim();

  if (trimmedContent.length < 1) {
    throw createAppError(ERROR_CODES.CONTENT_TOO_SHORT);
  }

  if (trimmedContent.length > 280) {
    throw createAppError(ERROR_CODES.CONTENT_TOO_LONG);
  }

  return true;
}

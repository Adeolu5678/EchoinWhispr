/**
 * Unit tests for error handling utilities
 */

import {
  createAppError,
  ERROR_CODES,
  mapHttpStatusToErrorCode,
  withRetry,
  validateWhisperContent,
  isRetryableError,
  AppError,
} from '../errors';

describe('errors', () => {
  describe('createAppError', () => {
    it('should create an error with the specified code', () => {
      const error = createAppError(ERROR_CODES.NETWORK_ERROR);
      
      expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      expect(error.message).toBeDefined();
    });

    it('should include custom message if provided', () => {
      const customMessage = 'Custom error message';
      const error = createAppError(ERROR_CODES.VALIDATION_ERROR, undefined, customMessage);
      
      expect(error.message).toBe(customMessage);
    });

    it('should include details when original error provided', () => {
      const originalError = new Error('Original error');
      const error = createAppError(ERROR_CODES.NETWORK_ERROR, originalError);
      
      expect(error.details).toBeDefined();
      expect(error.details?.originalError).toBeDefined();
    });
  });

  describe('mapHttpStatusToErrorCode', () => {
    it('should map 400 to VALIDATION_ERROR', () => {
      expect(mapHttpStatusToErrorCode(400)).toBe(ERROR_CODES.VALIDATION_ERROR);
    });

    it('should map 401 to UNAUTHORIZED', () => {
      expect(mapHttpStatusToErrorCode(401)).toBe(ERROR_CODES.UNAUTHORIZED);
    });

    it('should map 403 to FORBIDDEN', () => {
      expect(mapHttpStatusToErrorCode(403)).toBe(ERROR_CODES.FORBIDDEN);
    });

    it('should map 500 to SERVER_ERROR', () => {
      expect(mapHttpStatusToErrorCode(500)).toBe(ERROR_CODES.SERVER_ERROR);
    });

    it('should map unknown status to UNKNOWN_ERROR', () => {
      expect(mapHttpStatusToErrorCode(999)).toBe(ERROR_CODES.UNKNOWN_ERROR);
    });
  });

  describe('isRetryableError', () => {
    it('should return true for network errors', () => {
      const error: AppError = { code: ERROR_CODES.NETWORK_ERROR, message: 'Network error' };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for timeout errors', () => {
      const error: AppError = { code: ERROR_CODES.TIMEOUT_ERROR, message: 'Timeout' };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return false for validation errors', () => {
      const error: AppError = { code: ERROR_CODES.VALIDATION_ERROR, message: 'Invalid' };
      expect(isRetryableError(error)).toBe(false);
    });
  });

  describe('validateWhisperContent', () => {
    it('should return true for proper content', () => {
      const result = validateWhisperContent('Hello, world!');
      expect(result).toBe(true);
    });

    it('should throw for empty content', () => {
      expect(() => validateWhisperContent('')).toThrow();
    });

    it('should throw for whitespace-only content', () => {
      expect(() => validateWhisperContent('   \n\t  ')).toThrow();
    });

    it('should throw for content exceeding max length', () => {
      const longContent = 'x'.repeat(300);
      expect(() => validateWhisperContent(longContent)).toThrow();
    });

    it('should accept content at max length', () => {
      const maxContent = 'x'.repeat(280);
      expect(validateWhisperContent(maxContent)).toBe(true);
    });
  });

  describe('withRetry', () => {
    it('should succeed on first attempt if function succeeds', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      
      const result = await withRetry(mockFn);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('First failure'))
        .mockResolvedValue('success');
      
      const result = await withRetry(mockFn, 3, 10);
      
      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should throw after max retries', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('Always fails'));
      
      await expect(withRetry(mockFn, 2, 10)).rejects.toMatchObject({
        code: ERROR_CODES.RETRY_FAILED,
      });
      
      expect(mockFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('ERROR_CODES', () => {
    it('should define expected error codes', () => {
      expect(ERROR_CODES.NETWORK_ERROR).toBe('NETWORK_ERROR');
      expect(ERROR_CODES.VALIDATION_ERROR).toBe('VALIDATION_ERROR');
      expect(ERROR_CODES.UNAUTHORIZED).toBe('UNAUTHORIZED');
      expect(ERROR_CODES.UNKNOWN_ERROR).toBe('UNKNOWN_ERROR');
    });
  });
});

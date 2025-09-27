/**
 * Whisper service layer for the Web application
 * Handles all whisper-related operations with the Convex backend
 * Provides a clean API for components and hooks to interact with whisper data
 */

import { api } from '../../../lib/convex';
import convex from '../../../lib/convex';
import {
  Whisper,
  WhisperWithSender,
  SendWhisperRequest,
  SendWhisperResponse,
} from '../types';
import {
  createWhisperError,
  mapConvexErrorToErrorCode,
  validateWhisperContent,
  withRetry,
  ERROR_CODES,
} from '../../../lib/errors';
import { currentUser } from '@clerk/nextjs/server';
import type { Id } from 'convex/values';

/**
 * Service class for whisper operations
 * Encapsulates all business logic for whisper management
 */
class WhisperService {
  /**
   * Sends a whisper to a recipient
   * @param request - The whisper request data
   * @returns Promise resolving to the send response
   */
  async sendWhisper(request: SendWhisperRequest): Promise<SendWhisperResponse> {
    try {
      // Validate input
      validateWhisperContent(request.content);

      // Get current user ID from Clerk
      const user = await currentUser();

      if (!user?.id) {
        throw createWhisperError(ERROR_CODES.UNAUTHORIZED);
      }

      // Prepare whisper data - sendWhisper expects recipientUsername string
      const whisperData = {
        recipientUsername: request.recipientUsername,
        content: request.content.trim(),
      };

      // Send whisper using Convex mutation with retry logic
      const result = await withRetry(async () => {
        return await convex.mutation(api.whispers.sendWhisper, whisperData);
      });

      return {
        success: true,
        whisperId: result,
      };
    } catch (error) {
      // Handle specific error types
      if (error instanceof Error && 'code' in error) {
        // Already a WhisperError
        throw error;
      }

      // Map unknown errors to WhisperError
      const errorCode = mapConvexErrorToErrorCode(error);
      throw createWhisperError(errorCode, error);
    }
  }

  /**
   * Retrieves all whispers received by the current user
   * @returns Promise resolving to array of whispers with sender information
   */
  async getReceivedWhispers(): Promise<WhisperWithSender[]> {
    try {
      // Get current user ID from Clerk
      const user = await currentUser();

      if (!user?.id) {
        throw createWhisperError(ERROR_CODES.UNAUTHORIZED);
      }

      const convexUser = await convex.query(api.users.getCurrentUser);
      if (!convexUser) {
        throw createWhisperError(ERROR_CODES.USER_NOT_FOUND);
      }

      // Fetch whispers using Convex query with retry logic
      // Note: getReceivedWhispers doesn't require userId parameter
      const whispers = await withRetry(async () => {
        return await convex.query(api.whispers.getReceivedWhispers);
      });

      // Transform whispers to include sender information and computed fields
      return this.transformWhispersForDisplay(whispers, convexUser._id);
    } catch (error) {
      const errorCode = mapConvexErrorToErrorCode(error);
      throw createWhisperError(errorCode, error);
    }
  }

  /**
   * Marks a whisper as read
   * @param whisperId - The ID of the whisper to mark as read
   * @returns Promise resolving when the operation completes
   */
  async markWhisperAsRead(whisperId: string): Promise<void> {
    try {
      // Get current user ID from Clerk
      const user = await currentUser();

      if (!user?.id) {
        throw createWhisperError(ERROR_CODES.UNAUTHORIZED);
      }

      // Mark whisper as read using Convex mutation with retry logic
      await withRetry(async () => {
        return await convex.mutation(api.whispers.markWhisperAsRead, {
          whisperId: whisperId as Id<'whispers'>,
        });
      });
    } catch (error) {
      const errorCode = mapConvexErrorToErrorCode(error);
      throw createWhisperError(errorCode, error);
    }
  }

  /**
   * Transforms raw whisper data for display purposes
   * Adds computed fields like formatted time, sender info, etc.
   * @param whispers - Raw whisper data from Convex
   * @param currentUserId - Current user's ID for determining ownership
   * @returns Array of whispers with display-friendly data
   */
  private transformWhispersForDisplay(
    whispers: Whisper[],
    currentUserId: Id<"users">
  ): WhisperWithSender[] {
    return whispers.map(whisper => {
      // Determine if this whisper belongs to the current user
      const isOwnWhisper = whisper.senderId === currentUserId;

      // Format timestamps for display
      const createdAt = new Date(whisper._creationTime);
      const formattedTime = createdAt.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      // Calculate relative time (e.g., "2 hours ago")
      const relativeTime = this.getRelativeTime(createdAt);

      return {
        ...whisper,
        isOwnWhisper,
        formattedTime,
        relativeTime,
        // Note: In a real implementation, you would fetch sender info from Clerk
        // For now, we'll use placeholder data
        senderName: isOwnWhisper ? 'You' : 'Anonymous',
        senderAvatar: undefined,
      };
    });
  }

  /**
   * Calculates relative time string (e.g., "2 hours ago", "yesterday")
   * @param date - The date to calculate relative time for
   * @returns Human-readable relative time string
   */
  private getRelativeTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return count === 1
          ? `1 ${interval.label} ago`
          : `${count} ${interval.label}s ago`;
      }
    }

    return 'Just now';
  }
}

// Export singleton instance
export const whisperService = new WhisperService();
export default whisperService;

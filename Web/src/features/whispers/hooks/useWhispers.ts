/**
 * Custom hooks for whisper operations
 * Provides React-friendly APIs for whisper functionality with real-time updates
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { whisperService } from '../services/whisperService';
import {
  WhisperWithSender,
  SendWhisperRequest,
  SendWhisperResponse,
} from '../types';
import { ERROR_CODES, AppError } from '../../../lib/errors';
import { useToast } from '../../../hooks/use-toast';

/**
 * Provides utilities to send a whisper and track send state and errors.
 *
 * @returns An object with:
 * - `sendWhisper(request)`: Sends a whisper for the current user and resolves with the send response; may reject with `AppError`.
 * - `isLoading`: `true` while a send is in progress.
 * - `error`: the last `AppError` encountered, or `null`.
 * - `clearError()`: resets `error` to `null`.
 */
export function useSendWhisper() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  /**
   * Sends a whisper with optimistic updates
   * @param request - The whisper request data
   * @returns Promise resolving to the send response
   */
  const sendWhisper = useCallback(
    async (request: SendWhisperRequest): Promise<SendWhisperResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await whisperService.sendWhisper(request, user?.id || '');

        // Show success toast
        toast({
          title: 'Whisper sent!',
          description: 'Your anonymous message has been delivered.',
        });

        return result;
      } catch (err) {
        const whisperError = err as AppError;
        setError(whisperError);

        // Show error toast
        toast({
          title: 'Failed to send whisper',
          description:
            whisperError.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });

        throw whisperError;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, user?.id]
  );

  return {
    sendWhisper,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Manages fetching and local state for received whispers, including unread counts.
 *
 * Provides the current list of received whispers, loading and error state, derived
 * unread metadata, and utilities to refetch or clear errors.
 *
 * @returns An object with:
 * - `whispers`: Array of received whispers with sender information.
 * - `isLoading`: `true` while whispers are being fetched, `false` otherwise.
 * - `error`: The last `AppError` encountered or `null` if none.
 * - `unreadCount`: Number of whispers where `isRead` is `false`.
 * - `hasUnread`: `true` if `unreadCount` is greater than zero, `false` otherwise.
 * - `refetch`: Function that re-fetches the received whispers.
 * - `clearError`: Function that resets the stored `error` to `null`.
 */
export function useReceivedWhispers() {
  const [whispers, setWhispers] = useState<WhisperWithSender[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  /**
   * Fetches whispers from the service
   */
  const fetchWhispers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedWhispers = await whisperService.getReceivedWhispers(user?.id || '');
      setWhispers(fetchedWhispers);
    } catch (err) {
      const whisperError = err as AppError;
      setError(whisperError);

      // Only show toast for non-auth errors
      if (whisperError.code !== ERROR_CODES.UNAUTHORIZED) {
        toast({
          title: 'Failed to load whispers',
          description: whisperError.message || 'Unable to fetch your messages.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [toast, user?.id]);

  // Fetch whispers on mount
  useEffect(() => {
    fetchWhispers();
  }, [fetchWhispers]);

  // Computed values
  const unreadCount = useMemo(() => {
    return whispers.filter((whisper: WhisperWithSender) => !whisper.isRead)
      .length;
  }, [whispers]);

  const hasUnread = useMemo(() => {
    return unreadCount > 0;
  }, [unreadCount]);

  return {
    whispers,
    isLoading,
    error,
    unreadCount,
    hasUnread,
    refetch: fetchWhispers,
    clearError: () => setError(null),
  };
}

/**
 * Provides functionality to mark a whisper as read and track operation state.
 *
 * @returns An object with:
 * - `markAsRead(whisperId)`: function that marks the whisper with the given ID as read.
 * - `isLoading`: `true` while the mark-as-read request is in progress, `false` otherwise.
 * - `error`: the last `AppError` encountered or `null` if none.
 * - `clearError()`: function that clears the stored error.
 */
export function useMarkAsRead() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  /**
   * Marks a whisper as read with optimistic updates
   * @param whisperId - The ID of the whisper to mark as read
   */
  const markAsRead = useCallback(
    async (whisperId: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await whisperService.markWhisperAsRead(whisperId, user?.id || '');

        // Show success toast
        toast({
          title: 'Message marked as read',
          description: 'The whisper has been marked as read.',
        });
      } catch (err) {
        const whisperError = err as AppError;
        setError(whisperError);

        toast({
          title: 'Failed to mark as read',
          description:
            whisperError.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });

        throw whisperError;
      } finally {
        setIsLoading(false);
      }
    },
    [toast, user?.id]
  );

  return {
    markAsRead,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}

/**
 * Exposes sending, receiving, and mark-as-read whisper functionality as a single unified hook.
 *
 * @returns An object exposing:
 * - `sendWhisper`: function to send a whisper
 * - `isSending`: loading state for sending
 * - `sendError`: error from sending
 * - `whispers`: received whispers array
 * - `isLoadingWhispers`: loading state for fetching whispers
 * - `whispersError`: error from fetching whispers
 * - `unreadCount`: number of unread whispers
 * - `hasUnread`: `true` if there are unread whispers, `false` otherwise
 * - `refetchWhispers`: function to refetch received whispers
 * - `markAsRead`: function to mark a whisper as read
 * - `isMarkingAsRead`: loading state for marking as read
 * - `markAsReadError`: error from marking as read
 * - `clearErrors`: clears errors from all underlying whisper operations
 */
export function useWhispers() {
  const sendWhisper = useSendWhisper();
  const receivedWhispers = useReceivedWhispers();
  const markAsRead = useMarkAsRead();

  return {
    // Send functionality
    sendWhisper: sendWhisper.sendWhisper,
    isSending: sendWhisper.isLoading,
    sendError: sendWhisper.error,

    // Receive functionality
    whispers: receivedWhispers.whispers,
    isLoadingWhispers: receivedWhispers.isLoading,
    whispersError: receivedWhispers.error,
    unreadCount: receivedWhispers.unreadCount,
    hasUnread: receivedWhispers.hasUnread,
    refetchWhispers: receivedWhispers.refetch,

    // Mark as read functionality
    markAsRead: markAsRead.markAsRead,
    isMarkingAsRead: markAsRead.isLoading,
    markAsReadError: markAsRead.error,

    // Utility functions
    clearErrors: () => {
      sendWhisper.clearError();
      receivedWhispers.clearError();
      markAsRead.clearError();
    },
  };
}

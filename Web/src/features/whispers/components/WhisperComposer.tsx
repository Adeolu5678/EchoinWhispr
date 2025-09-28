'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSendWhisper } from '../hooks/useWhispers';
import { WHISPER_LIMITS } from '../types';
import { RecipientSelector } from './RecipientSelector';
import { UserSearchResult } from '@/types/user';
import { Users, X, Send } from 'lucide-react';


interface WhisperComposerProps {
  onWhisperSent?: () => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

/**
 * Enhanced WhisperComposer component with user search integration
 *
 * Provides a complete interface for composing and sending anonymous whispers
 * with the ability to search for and select a single recipient.
 *
 * Features:
 * - User search with real-time results
 * - Single recipient selection
 * - Visual feedback for selected user
 * - Character limit validation
 * - Loading states and error handling
 *
 * @param onWhisperSent - Optional callback fired when whisper is successfully sent
 * @param placeholder - Placeholder text for the textarea
 * @param maxLength - Maximum character limit for the whisper content
 * @param className - Additional CSS classes
 */
export const WhisperComposer: React.FC<WhisperComposerProps> = ({
  onWhisperSent,
  placeholder = 'Write your anonymous whisper...',
  maxLength = WHISPER_LIMITS.MAX_CONTENT_LENGTH,
  className = '',
}) => {
  // Component state
  const [content, setContent] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const { sendWhisper, isLoading, error } = useSendWhisper();

  /**
   * Handles content change with character limit validation
   * Prevents input beyond the maximum character limit
   */
  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;

      // Enforce character limit
      if (newContent.length <= maxLength) {
        setContent(newContent);
      }
    },
    [maxLength]
  );

  /**
   * Handles user selection from search results
   * For single recipient selection, replaces current selection
   */
  const handleUserToggle = useCallback((user: UserSearchResult) => {
    setSelectedUser(user);
  }, []);

  /**
   * Handles user removal from selected list
   */
  const handleRemoveUser = useCallback(() => {
    setSelectedUser(null);
  }, []);

  /**
   * Handles whisper submission with validation
   * Prevents empty or whitespace-only whispers from being sent
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate content
      const trimmedContent = content.trim();
      if (
        !trimmedContent ||
        trimmedContent.length < WHISPER_LIMITS.MIN_CONTENT_LENGTH
      ) {
        return;
      }

      // Validate recipients
      if (!selectedUser) {
        return;
      }

      try {
        // Send whisper using the hook
        await sendWhisper({
          recipientUsername: selectedUser.username,
          content: trimmedContent,
        });

        // Clear content and selected user, notify parent component
        setContent('');
        setSelectedUser(null);
        onWhisperSent?.();
      } catch (error) {
        // Error handling is managed by the hook with toast notifications
        // Additional logging for debugging purposes
        console.error('Failed to send whisper:', error);
      }
    },
    [content, selectedUser, sendWhisper, onWhisperSent]
  );

  /**
   * Calculates remaining characters for display
   */
  const remainingChars = useMemo(
    () => maxLength - content.length,
    [maxLength, content]
  );

  /**
   * Determines if the send button should be disabled
   * Disabled when content is empty, no recipients selected, loading, or exceeds character limit
   */
  const isDisabled = useMemo(() => {
    const hasValidContent =
      content.trim().length >= WHISPER_LIMITS.MIN_CONTENT_LENGTH;
    const hasRecipients = selectedUser !== null;
    const withinLimit = content.length <= maxLength;

    return !hasValidContent || !hasRecipients || !withinLimit || isLoading;
  }, [content, selectedUser, maxLength, isLoading]);

  /**
   * Determines the character count color based on remaining characters
   * Red for over limit, yellow for low remaining, gray for normal
   */
  const characterCountColor = useMemo(() => {
    if (remainingChars < 0) return 'text-red-500';
    if (remainingChars <= 20) return 'text-yellow-500';
    return 'text-muted-foreground';
  }, [remainingChars]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* User Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Select Recipients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecipientSelector
            selectedRecipient={selectedUser}
            onRecipientSelect={handleUserToggle}
          />
        </CardContent>
      </Card>

      {/* Selected User Display */}
      {selectedUser && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Selected Recipient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                <Users className="h-3 w-3" />
                User {selectedUser.username.slice(-8)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveUser}
                  className="h-auto p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Whisper Composition Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Send className="h-5 w-5" />
            Compose Whisper
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            role="form"
            aria-label="Compose whisper"
          >
            <div className="space-y-2">
              <Textarea
                value={content}
                onChange={handleContentChange}
                placeholder={placeholder}
                disabled={isLoading}
                className="min-h-[120px] resize-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Whisper content"
                aria-describedby="char-count error-message"
                aria-invalid={remainingChars < 0}
              />

              <div className="flex justify-between items-center text-sm">
                <div
                  id="char-count"
                  className={characterCountColor}
                  aria-live="polite"
                  aria-label={`${remainingChars} characters remaining`}
                >
                  {remainingChars} characters remaining
                </div>

                {error && (
                  <div
                    id="error-message"
                    className="text-red-500"
                    role="alert"
                    aria-live="assertive"
                  >
                    {error.message}
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full h-11 text-base font-medium"
              aria-label={isLoading ? 'Sending whisper...' : 'Send whisper'}
            >
              {isLoading ? 'Sending...' : 'Send Whisper'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

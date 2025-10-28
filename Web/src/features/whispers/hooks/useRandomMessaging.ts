import { useState, useCallback } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { FEATURE_FLAGS } from '@/config/featureFlags';

interface UseRandomMessagingReturn {
  messageCount: number;
  isLoading: boolean;
  selectRandomRecipient: () => Promise<string | null>;
  sendRandomMessage: (content: string) => Promise<void>;
  error: string | null;
}

export const useRandomMessaging = (): UseRandomMessagingReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRandomMessageMutation = useMutation(api.randomMessages.sendRandomMessage);
  const getRandomRecipientMutation = useMutation(api.randomMessages.getRandomRecipient);

  const userMessageCount = useQuery(
    api.randomMessages.getRandomMessageCount,
    FEATURE_FLAGS.RANDOM_ANONYMOUS_MESSAGING ? {} : 'skip'
  );

  const selectRandomRecipient = useCallback(async (): Promise<string | null> => {
    if (!FEATURE_FLAGS.RANDOM_ANONYMOUS_MESSAGING) {
      setError('Random messaging feature is not enabled');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use Convex API which handles Hedera integration internally
      const recipientId = await getRandomRecipientMutation();
      return recipientId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to select random recipient';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getRandomRecipientMutation]);

  const sendRandomMessage = useCallback(async (content: string): Promise<void> => {
    if (!FEATURE_FLAGS.RANDOM_ANONYMOUS_MESSAGING) {
      throw new Error('Random messaging feature is not enabled');
    }

    if (!content.trim()) {
      throw new Error('Message content cannot be empty');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Send random message through Convex (which will handle Hedera integration)
      await sendRandomMessageMutation({ content: content.trim() });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send random message';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [sendRandomMessageMutation]);

  return {
    messageCount: userMessageCount ?? 0,
    isLoading,
    selectRandomRecipient,
    sendRandomMessage,
    error,
  };
};
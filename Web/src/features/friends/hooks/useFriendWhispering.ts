import { useCallback, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { useConvex } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';

interface SendFriendWhisperParams {
  recipientUsername: string;
  content: string;
  imageUrl?: string;
}

interface UseFriendWhisperingReturn {
  sendFriendWhisper: (params: SendFriendWhisperParams) => Promise<void>;
  isLoading: boolean;
  validateUsername: (username: string) => Promise<boolean>;
  sentWhispers: any[];
  receivedWhispers: any[];
  isUsernameValidating: boolean;
  checkFriendship: (username: string) => Promise<boolean>;
  isFriendshipChecking: boolean;
}

/**
 * Hook for friend whispering functionality.
 * Provides functions for sending friend whispers, username validation, and friendship verification.
 */
export const useFriendWhispering = (): UseFriendWhisperingReturn => {
  const { toast } = useToast();
  const convex = useConvex();

  const [isLoading, setIsLoading] = useState(false);
  const [isUsernameValidating, setIsUsernameValidating] = useState(false);
  const [isFriendshipChecking, setIsFriendshipChecking] = useState(false);

  const sendFriendWhisperMutation = useMutation(api.friends.sendFriendWhisper);
  const sentWhispers = useQuery(api.friends.getSentFriendWhispers) || [];
  const receivedWhispers = useQuery(api.friends.getReceivedFriendWhispers) || [];

  const sendFriendWhisper = useCallback(
    async ({ recipientUsername, content, imageUrl }: SendFriendWhisperParams) => {
      setIsLoading(true);
      try {
        await sendFriendWhisperMutation({ recipientUsername, content, imageUrl });

        toast({
          title: 'Friend whisper sent!',
          description: `Your anonymous message has been sent to ${recipientUsername}.`,
        });
      } catch (error) {
        console.error('Failed to send friend whisper:', error);
        toast({
          title: 'Error',
          description: 'Failed to send friend whisper',
          variant: 'destructive',
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [sendFriendWhisperMutation, toast]
  );

  const validateUsername = useCallback(
    async (username: string): Promise<boolean> => {
      setIsUsernameValidating(true);
      try {
        const result = await convex.query(api.users.checkUsernameAvailability, { username });
        return !result; // Username is valid if it's NOT available (exists)
      } catch (error) {
        console.error('Failed to validate username:', error);
        return false;
      } finally {
        setIsUsernameValidating(false);
      }
    },
    [convex]
  );

  const checkFriendship = useCallback(
    async (username: string): Promise<boolean> => {
      setIsFriendshipChecking(true);
      try {
        const currentUser = await convex.query(api.users.getCurrentUser);
        if (!currentUser) return false;

        const result = await convex.query(api.friends.checkFriendship, {
          userId: currentUser._id,
          friendUsername: username
        });
        return result?.isFriend ?? false;
      } catch (error) {
        console.error('Failed to check friendship:', error);
        return false;
      } finally {
        setIsFriendshipChecking(false);
      }
    },
    [convex]
  );

  return {
    sendFriendWhisper,
    isLoading,
    validateUsername,
    sentWhispers,
    receivedWhispers,
    isUsernameValidating,
    checkFriendship,
    isFriendshipChecking,
  };
};
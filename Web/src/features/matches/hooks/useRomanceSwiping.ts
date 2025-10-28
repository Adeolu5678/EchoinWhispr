'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api, Id } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import { FEATURE_FLAGS } from '@/config/featureFlags';

interface RomanceSwipingData {
  personas: Array<{
    id: Id<'users'>;
    username: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    skills: string[];
    interests: string[];
    humor?: string;
    career?: string;
    expertise?: string;
  }> | undefined;
  remainingSwipes: number;
  isLoading: boolean;
  swipe: (userId: Id<'users'>, action: 'like' | 'dislike') => Promise<void>;
  undo: () => Promise<void>;
  refreshPersonas: () => void;
}

/**
 * useRomanceSwiping hook provides functionality for Tinder-like swiping feature.
 * Handles persona fetching, swipe actions, limit tracking, and match creation.
 *
 * @returns Object containing personas, swipe functions, and limit tracking
 */
export const useRomanceSwiping = (): RomanceSwipingData => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Always call useQuery hooks in the same order
  const personasQuery = useQuery(api.romanceSwiping.getSwipeablePersonas, {});
  const swipeLimitsQuery = useQuery(api.romanceSwiping.getSwipeLimits, {});

  // Filter results based on feature flags
  const personas = FEATURE_FLAGS.TINDER_LIKE_SWIPING_FOR_ROMANCE ? personasQuery ?? [] : [];
  const remainingSwipes = FEATURE_FLAGS.TINDER_LIKE_SWIPING_FOR_ROMANCE && FEATURE_FLAGS.DAILY_LIMITS_SUBSCRIPTION_INTEGRATION
    ? swipeLimitsQuery?.remainingSwipes ?? 0
    : 0;

  // Mutations for swipe actions
  const recordSwipeMutation = useMutation(api.romanceSwiping.recordSwipe);
  const undoSwipeMutation = useMutation(api.romanceSwiping.undoSwipe);

  // personas and remainingSwipes are now defined above

  const swipe = useCallback(async (userId: Id<'users'>, action: 'like' | 'dislike') => {
    if (!FEATURE_FLAGS.TINDER_LIKE_SWIPING_FOR_ROMANCE) {
      toast({
        title: 'Feature not available',
        description: 'Romantic swiping is not yet available.',
        variant: 'destructive',
      });
      return;
    }

    if (remainingSwipes <= 0) {
      toast({
        title: 'Daily limit reached',
        description: 'You\'ve reached your daily swipe limit. Upgrade for unlimited swipes!',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await recordSwipeMutation({ swipedUserId: userId, action });

      if (action === 'like') {
        toast({
          title: 'Liked!',
          description: 'Your interest has been recorded.',
        });
      }
    } catch (error) {
      console.error('Swipe recording failed:', error);
      toast({
        title: 'Swipe failed',
        description: 'Failed to record your swipe. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [recordSwipeMutation, remainingSwipes, toast]);

  const undo = useCallback(async () => {
    if (!FEATURE_FLAGS.TINDER_LIKE_SWIPING_FOR_ROMANCE) {
      return;
    }

    setIsLoading(true);

    try {
      await undoSwipeMutation({});
      toast({
        title: 'Undone',
        description: 'Your last swipe has been undone.',
      });
    } catch (error) {
      console.error('Undo failed:', error);
      toast({
        title: 'Undo failed',
        description: 'Failed to undo your last swipe.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [undoSwipeMutation, toast]);

  const refreshPersonas = useCallback(() => {
    // Force refresh by invalidating the query cache
    // In Convex, queries are reactive, but we can trigger a refresh by changing dependencies
    // For now, this is a placeholder - actual implementation would depend on Convex's cache invalidation
    console.log('Refreshing personas...');
  }, []);

  return {
    personas,
    remainingSwipes,
    isLoading,
    swipe,
    undo,
    refreshPersonas,
  };
};
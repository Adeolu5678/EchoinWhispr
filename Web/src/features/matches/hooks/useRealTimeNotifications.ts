import { useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeNotifications = (userId: string) => {
  const { toast } = useToast();
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  const newMutualMatches = useQuery(
    (FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM && api.matches.getNewMutualMatches) || 'skip',
    FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM && userId ? { userId: userId as any } : 'skip'
  );
  const markAsSeenMutation = useMutation(api.matches.markNotificationsAsSeen);

  useEffect(() => {
    if (!FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM || !newMutualMatches) return;

    const currentCount = newMutualMatches.length;

    // Only show notification if we have new matches since last check
    if (currentCount > lastNotificationCount && currentCount > 0) {
      const newMatchesCount = currentCount - lastNotificationCount;

      toast({
        title: `New Mutual Match${newMatchesCount > 1 ? 'es' : ''}! 🎉`,
        description: newMatchesCount === 1
          ? 'Someone you liked has liked you back. Check your matches!'
          : `${newMatchesCount} new mutual matches! Check your matches!`,
        variant: 'default',
        duration: 5000,
      });

      // Mark notifications as seen after showing the toast
      markAsSeenMutation({ userId: userId as any }).catch(error => {
        console.error('Failed to mark notifications as seen:', error);
      });
    }

    setLastNotificationCount(currentCount);
  }, [newMutualMatches, lastNotificationCount, toast, markAsSeenMutation, userId]);

  return {
    newMutualMatches: newMutualMatches || [],
    isEnabled: FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM,
    notificationCount: newMutualMatches?.length || 0,
  };
};
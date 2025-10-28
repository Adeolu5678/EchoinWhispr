import { useUser } from '@clerk/nextjs';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { Mood, MoodConnectionStatus, MoodConnection, MoodConnectionLimit } from '@/features/profile/types';

/**
 * Hook for mood-based matching functionality.
 * Provides functions for:
 * - Setting user mood
 * - Finding mood-based connection opportunities
 * - Initiating mood-based connections
 * - Tracking daily limits
 */
export const useMoodMatching = () => {
  const { user } = useUser();

  // Queries
  const moodConnections = useQuery(
    api.moodConnections.getMoodConnectionsForUser,
    FEATURE_FLAGS.MOOD_BASED_CONNECTIONS && user?.id ? { userId: user.id as any } : 'skip'
  );

  const userMood = useQuery(
    api.users.getCurrentUser,
    FEATURE_FLAGS.MOOD_BASED_CONNECTIONS ? {} : 'skip'
  );

  const dailyLimit = useQuery(
    api.moodConnections.getDailyLimit,
    FEATURE_FLAGS.MOOD_BASED_CONNECTIONS && user?.id ? { userId: user.id as any } : 'skip'
  );

  // Mutations
  const setMoodMutation = useMutation(api.moodConnections.setUserMood);
  const initiateConnectionMutation = useMutation(api.moodConnections.createMoodConnection);
  const updateConnectionStatusMutation = useMutation(api.moodConnections.updateConnectionStatus);

  /**
   * Sets the user's current mood.
   * @param mood - The mood to set
   */
  const setMood = async (mood: Mood) => {
    if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
      throw new Error('Mood-based connections feature is not enabled');
    }

    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    // Set loading state
    // Note: Since this is a hook, we can't directly modify state here
    // The loading state would need to be managed by the component using this hook

    try {
      return await setMoodMutation({ userId: user.id as any, mood });
    } catch (error) {
      console.error('Failed to set mood:', error);
      throw error;
    }
  };

  /**
   * Initiates a mood-based connection with another user.
   * @param matchedUserId - The ID of the user to connect with
   */
  const initiateConnection = async (matchedUserId: string) => {
    if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
      throw new Error('Mood-based connections feature is not enabled');
    }

    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    // Check daily limit
    const limit = dailyLimit || { count: 0, maxLimit: 5 };
    if (limit.count >= limit.maxLimit) {
      throw new Error('Daily connection limit reached');
    }

    try {
      return await initiateConnectionMutation({
        userId: user.id as any,
        matchedUserId: matchedUserId as any,
      });
    } catch (error) {
      console.error('Failed to initiate connection:', error);
      throw error;
    }
  };

  /**
   * Updates the status of a mood connection (accept, reject, skip).
   * @param connectionId - The connection ID
   * @param status - The new status
   */
  const updateConnectionStatus = async (connectionId: string, status: MoodConnectionStatus) => {
    if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
      throw new Error('Mood-based connections feature is not enabled');
    }

    try {
      return await updateConnectionStatusMutation({
        connectionId: connectionId as any,
        status,
      });
    } catch (error) {
      console.error('Failed to update connection status:', error);
      throw error;
    }
  };

  /**
   * Checks if the user can make more connections today.
   * @returns Object with limit info
   */
  const checkDailyLimit = () => {
    if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
      return { canConnect: false, reason: 'Feature not enabled' };
    }

    const limit = dailyLimit || { count: 0, maxLimit: 5 };
    const canConnect = limit.count < limit.maxLimit;

    return {
      canConnect,
      reason: canConnect ? 'Within limit' : 'Daily limit reached',
      currentCount: limit.count,
      maxLimit: limit.maxLimit,
    };
  };

  return {
    // Data
    moodConnections: (moodConnections || []) as MoodConnection[],
    userMood: (userMood?.mood as Mood) || null,
    dailyLimit: (dailyLimit || { count: 0, maxLimit: 5 }) as MoodConnectionLimit,

    // Actions
    setMood,
    initiateConnection,
    updateConnectionStatus,
    checkDailyLimit,

    // Loading states
    isLoading: moodConnections === undefined || userMood === undefined || dailyLimit === undefined,
    isSettingMood: false, // Convex mutations don't expose loading state directly
    isInitiatingConnection: false, // Convex mutations don't expose loading state directly
    isUpdatingConnection: false, // Convex mutations don't expose loading state directly

    // Error states
    moodConnectionsError: moodConnections === null,
    userMoodError: userMood === null,
    dailyLimitError: dailyLimit === null,

    // Feature flag
    isEnabled: FEATURE_FLAGS.MOOD_BASED_CONNECTIONS,
  };
};
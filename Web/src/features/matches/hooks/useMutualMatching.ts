import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';

export const useMutualMatching = (userId: string) => {
  const { toast } = useToast();

  // Queries
  const pendingMatches = useQuery(
    api.matches.getPendingMatches,
    FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM && userId ? { userId: userId as any } : 'skip'
  );

  const confirmedMatches = useQuery(
    api.matches.getConfirmedMatches,
    FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM && userId ? { userId: userId as any } : 'skip'
  );

  const mutualMatches = useQuery(
    api.matches.getMutualMatches,
    FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM && userId ? { userId: userId as any } : 'skip'
  );

  // Mutations
  const expressInterestMutation = useMutation(api.matches.expressInterest);
  const confirmMatchMutation = useMutation(api.matches.confirmMatch);
  const declineMatchMutation = useMutation(api.matches.declineMatch);

  const handleExpressInterest = async (matchId: string) => {
    if (!FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM) {
      toast({
        title: 'Feature not available',
        description: 'Mutual matching system is not yet available.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await expressInterestMutation({ matchId: matchId as any, userId: userId as any });
      toast({
        title: 'Interest expressed!',
        description: 'Your interest has been recorded. A match will be created if they feel the same way.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to express interest:', error);
      toast({
        title: 'Failed to express interest',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmMatch = async (matchId: string) => {
    if (!FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM) return;

    try {
      await confirmMatchMutation({ matchId: matchId as any, userId: userId as any });
      toast({
        title: 'Match confirmed!',
        description: 'You can now start a conversation with your match.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to confirm match:', error);
      toast({
        title: 'Failed to confirm match',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDeclineMatch = async (matchId: string) => {
    if (!FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM) return;

    try {
      await declineMatchMutation({ matchId: matchId as any, userId: userId as any });
      toast({
        title: 'Match declined',
        description: 'The match has been removed.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to decline match:', error);
      toast({
        title: 'Failed to decline match',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  return {
    // Data
    pendingMatches: pendingMatches || [],
    confirmedMatches: confirmedMatches || [],
    mutualMatches: mutualMatches || [],

    // Actions
    expressInterest: handleExpressInterest,
    confirmMatch: handleConfirmMatch,
    declineMatch: handleDeclineMatch,

    // Feature flag
    isEnabled: FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM,
  };
};
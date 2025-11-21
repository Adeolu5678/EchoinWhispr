'use client';

import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { FEATURE_FLAGS } from '@/config/featureFlags';

export function useSubscription() {
  const subscriptionStatus = useQuery(api.subscriptions.getSubscriptionStatus);
  const isEnabled = FEATURE_FLAGS.ENABLE_SUBSCRIPTIONS;

  return {
    isPremium: subscriptionStatus === 'premium',
    subscriptionStatus,
    isFeatureEnabled: isEnabled,
    isLoading: subscriptionStatus === undefined,
  };
}

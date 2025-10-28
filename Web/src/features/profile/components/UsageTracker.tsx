'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useQuery, skip } from 'convex/react';
import { api } from '@/lib/convex';
import { useUser } from '@clerk/nextjs';

/**
 * UsageTracker component displays current usage and limits for all features.
 * Shows progress bars, remaining usage, and subscription status.
 *
 * Foundation for DAILY_LIMITS_SUBSCRIPTION_INTEGRATION feature.
 */
export const UsageTracker: React.FC = () => {
  useUser(); // Hook is used for authentication state

  // Query for current user to get Convex user ID
  const currentUser = useQuery(api.users.getCurrentUser);

  // Query for usage limits
  const usageLimits = useQuery(
    FEATURE_FLAGS.DAILY_LIMITS_SUBSCRIPTION_INTEGRATION
      ? api.usageLimits.getUsageLimits
      : skip
  );

  // Query for usage data
  const usageData = useQuery(
    FEATURE_FLAGS.DAILY_LIMITS_SUBSCRIPTION_INTEGRATION && currentUser?._id
      ? api.usageLimits.getUserUsage
      : skip,
    currentUser?._id ? { userId: currentUser._id as any } : undefined
  );

  // Query for subscription status
  const subscriptionStatus = useQuery(
    FEATURE_FLAGS.DAILY_LIMITS_SUBSCRIPTION_INTEGRATION && currentUser?._id
      ? api.users.getSubscriptionStatus
      : skip,
    currentUser?._id ? { userId: currentUser._id as any } : undefined
  );

  if (!FEATURE_FLAGS.DAILY_LIMITS_SUBSCRIPTION_INTEGRATION) {
    return null;
  }

  // Loading states
  const isLoading = !currentUser || !usageLimits || !usageData || !subscriptionStatus;

  // Error states
  const hasError = !currentUser || !usageLimits || !usageData || !subscriptionStatus;

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (hasError) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Failed to load usage data. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const isSubscribed = subscriptionStatus?.isSubscribed || false;

  const features = [
    {
      key: 'mood_matches',
      name: 'Mood Matches',
      limit: usageLimits?.moodMatches || 2,
      used: usageData?.moodMatches || 0,
      icon: '😊',
    },
    {
      key: 'romance_swipes',
      name: 'Romance Swipes',
      limit: usageLimits?.romanceSwipes || 10,
      used: usageData?.romanceSwipes || 0,
      icon: '💕',
    },
    {
      key: 'random_messages',
      name: 'Random Messages',
      limit: usageLimits?.randomMessages || 5,
      used: usageData?.randomMessages || 0,
      icon: '💬',
    },
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Daily Usage</span>
          {isSubscribed && (
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map((feature) => {
          const progress = isSubscribed ? 0 : (feature.used / feature.limit) * 100;
          const isLimitReached = !isSubscribed && feature.used >= feature.limit;

          return (
            <div key={feature.key} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{feature.icon}</span>
                  <span>{feature.name}</span>
                </span>
                <span className={`font-medium ${isLimitReached ? 'text-red-500' : 'text-muted-foreground'}`}>
                  {isSubscribed ? 'Unlimited' : `${feature.used}/${feature.limit}`}
                </span>
              </div>
              {!isSubscribed && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${isLimitReached ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  ></div>
                </div>
              )}
              {isLimitReached && (
                <p className="text-xs text-red-500">
                  Daily limit reached. Upgrade for unlimited access!
                </p>
              )}
            </div>
          );
        })}

        {!isSubscribed && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Upgrade to Premium for unlimited daily usage
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
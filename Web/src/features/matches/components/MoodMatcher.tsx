'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useToast } from '@/hooks/use-toast';
import { MoodConnectionStatus } from '@/features/profile/types';

interface MoodMatcherProps {
  moodConnections: MoodConnection[];
  onConnect: (connectionId: string, status: MoodConnectionStatus) => void;
  onSkip: (connectionId: string, status: MoodConnectionStatus) => void;
  isLoading?: boolean;
  className?: string;
}

interface MoodConnection {
  _id: string;
  userId: string;
  matchedUserId: string;
  mood: string;
  status: string;
  createdAt: number;
  matchedUser?: {
    firstName?: string;
    lastName?: string;
    username?: string;
  };
}

/**
 * MoodMatcher component displays mood-based connection opportunities.
 * This is a foundation component for the MOOD_BASED_CONNECTIONS feature.
 *
 * @param moodConnections - Array of mood-based connection opportunities
 * @param onConnect - Callback when user wants to connect
 * @param onSkip - Callback when user wants to skip
 * @param isLoading - Whether the component is in loading state
 * @param className - Additional CSS classes
 */
export const MoodMatcher: React.FC<MoodMatcherProps> = ({
  moodConnections,
  onConnect,
  onSkip,
  isLoading = false,
  className = '',
}) => {
  const { toast } = useToast();

  const handleConnect = async (connectionId: string) => {
    if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
      toast({
        title: 'Feature not available',
        description: 'Mood-based connections are not yet available.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onConnect(connectionId, MoodConnectionStatus.ACCEPTED);
      toast({
        title: 'Connection initiated',
        description: 'Your mood-based connection request has been sent!',
      });
    } catch (error) {
      console.error('Failed to connect:', error);
      toast({
        title: 'Connection failed',
        description: 'Failed to initiate connection. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSkip = async (connectionId: string) => {
    try {
      await onSkip(connectionId, MoodConnectionStatus.SKIPPED);
    } catch (error) {
      console.error('Failed to skip:', error);
      toast({
        title: 'Skip failed',
        description: 'Failed to skip connection. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
    return (
      <Card className={`opacity-50 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg">Mood Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Mood-based connections coming soon! Connect with others feeling the same way as you.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (moodConnections.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">Mood Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No mood connections available right now. Check back later or update your mood to find matches!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Mood Connections</CardTitle>
        <p className="text-sm text-muted-foreground">
          Connect with others feeling the same way today.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {moodConnections.map((connection) => (
          <div
            key={connection._id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-lg">
                  {connection.matchedUser?.firstName?.[0] || connection.matchedUser?.username?.[0] || '?'}
                </span>
              </div>
              <div>
                <p className="font-medium">
                  {connection.matchedUser?.firstName && connection.matchedUser?.lastName
                    ? `${connection.matchedUser.firstName} ${connection.matchedUser.lastName}`
                    : connection.matchedUser?.username || 'Anonymous User'}
                </p>
                <Badge variant="secondary" className="text-xs">
                  Feeling {connection.mood}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSkip(connection._id)}
                disabled={isLoading}
              >
                Skip
              </Button>
              <Button
                size="sm"
                onClick={() => handleConnect(connection._id)}
                disabled={isLoading}
              >
                Connect
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
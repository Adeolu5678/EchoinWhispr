import React from 'react';
import { useQuery } from 'convex/react';
import { api, Id } from '@/lib/convex';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Heart, CheckCircle, XCircle } from 'lucide-react';
import { useMutualMatching } from '../hooks/useMutualMatching';

interface MatchNotificationsProps {
  userId: string;
}

export const MatchNotifications: React.FC<MatchNotificationsProps> = ({ userId }) => {
  const mutualMatches = useQuery(api.matches.getNewMutualMatches, { userId: userId as Id<"users"> }) || [];
  const { confirmMatch, declineMatch } = useMutualMatching(userId);

  if (!FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM) {
    return null;
  }

  const handleAcceptMatch = async (matchId: string) => {
    await confirmMatch(matchId);
  };

  const handleDeclineMatch = async (matchId: string) => {
    await declineMatch(matchId);
  };

  if (!mutualMatches || mutualMatches.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Match Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No new matches to review.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Match Notifications
          <Badge variant="secondary">{mutualMatches.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mutualMatches.map((match) => (
          <div key={match._id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="font-medium">New mutual interest!</p>
                <p className="text-sm text-muted-foreground">
                  Someone has expressed interest in you
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDeclineMatch(match._id)}
                className="text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                onClick={() => handleAcceptMatch(match._id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
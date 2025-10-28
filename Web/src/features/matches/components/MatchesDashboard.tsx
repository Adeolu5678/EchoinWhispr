import React from 'react';
import { useQuery } from 'convex/react';
import { api, Id } from '@/lib/convex';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Clock, CheckCircle, MessageCircle } from 'lucide-react';

interface MatchesDashboardProps {
  userId: string;
}

export const MatchesDashboard: React.FC<MatchesDashboardProps> = ({ userId }) => {
  const pendingMatches = useQuery(api.matches.getPendingMatches, { userId: userId as Id<"users"> }) || [];
  const confirmedMatches = useQuery(api.matches.getConfirmedMatches, { userId: userId as Id<"users"> }) || [];
  const conversations = useQuery(api.matches.getMutualMatches, { userId: userId as Id<"users"> }) || [];

  if (!FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            My Matches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending
                {pendingMatches && pendingMatches.length > 0 && (
                  <Badge variant="secondary">{pendingMatches.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Confirmed
                {confirmedMatches && confirmedMatches.length > 0 && (
                  <Badge variant="secondary">{confirmedMatches.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="conversations" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Conversations
                {conversations && conversations.length > 0 && (
                  <Badge variant="secondary">{conversations.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Pending Matches</h3>
                <p className="text-muted-foreground">
                  Matches waiting for mutual confirmation will appear here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="confirmed" className="space-y-4">
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Confirmed Matches</h3>
                <p className="text-muted-foreground">
                  Your confirmed matches will appear here. Start a conversation to connect!
                </p>
              </div>
            </TabsContent>

            <TabsContent value="conversations" className="space-y-4">
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Active Conversations</h3>
                <p className="text-muted-foreground">
                  Your ongoing conversations with matches will appear here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
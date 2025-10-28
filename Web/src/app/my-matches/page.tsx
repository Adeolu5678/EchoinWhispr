'use client';

import { useUser } from '@clerk/nextjs';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { MatchesDashboard } from '@/features/matches/components';

/**
 * My Matches page component for viewing mutual matches.
 *
 * This page displays the user's mutual matches dashboard with pending, confirmed,
 * and conversation tabs. The entire page is wrapped with a feature flag check.
 */
export default function MyMatchesPage() {
  const { user } = useUser();
  const userId = user?.id;

  if (!FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">
            Feature Not Available
          </h1>
          <p className="text-muted-foreground">
            Mutual matching is currently disabled.
          </p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">
            Authentication Required
          </h1>
          <p className="text-muted-foreground">
            Please sign in to view your matches.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Matches</h1>
          <p className="text-muted-foreground">
            View and manage your mutual matches and conversations.
          </p>
        </div>
        <MatchesDashboard userId={userId} />
      </main>
    </div>
  );
}
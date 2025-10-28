'use client';

import { FEATURE_FLAGS } from '@/config/featureFlags';
import { MoodMatcher } from '@/features/matches/components';
import { useMoodMatching } from '@/features/matches/hooks';
import { MoodConnectionStatus } from '@/features/profile/types';

/**
 * Mood Match page component for mood-based connections.
 *
 * This page displays mood-based connection opportunities using the MoodMatcher component.
 * The entire page is wrapped with a feature flag check to conditionally render the functionality.
 */
export default function MoodMatchPage() {
  if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">
            Feature Not Available
          </h1>
          <p className="text-muted-foreground">
            Mood-based connections are currently disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mood Match</h1>
          <p className="text-muted-foreground">
            Connect with others feeling the same way as you today.
          </p>
        </div>
        <MoodMatchContent />
      </main>
    </div>
  );
}

/**
 * Mood Match content component that handles the mood matching logic.
 */
function MoodMatchContent() {
  const {
    moodConnections,
    updateConnectionStatus,
    isLoading,
  } = useMoodMatching();

  const handleConnect = (connectionId: string) => {
    updateConnectionStatus(connectionId, MoodConnectionStatus.ACCEPTED);
  };

  const handleSkip = (connectionId: string) => {
    updateConnectionStatus(connectionId, MoodConnectionStatus.SKIPPED);
  };

  return (
    <MoodMatcher
      moodConnections={moodConnections}
      onConnect={handleConnect}
      onSkip={handleSkip}
      isLoading={isLoading}
    />
  );
}
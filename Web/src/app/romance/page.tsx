'use client';

import { FEATURE_FLAGS } from '@/config/featureFlags';
import { RomanceSwiper } from '@/features/matches/components';
import { useRomanceSwiping } from '@/features/matches/hooks';
import { Id } from '@/lib/convex';

/**
 * Romance page component for Tinder-like swiping feature.
 *
 * This page displays the romantic connections interface with swipeable persona cards.
 * The entire page is wrapped with a feature flag check to conditionally render the functionality.
 */
export default function RomancePage() {
  if (!FEATURE_FLAGS.TINDER_LIKE_SWIPING_FOR_ROMANCE) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">
            Feature Not Available
          </h1>
          <p className="text-muted-foreground">
            Romantic connections are currently disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Romance</h1>
          <p className="text-muted-foreground">
            Swipe through personas to find romantic connections.
          </p>
        </div>
        <RomancePageContent />
      </main>
    </div>
  );
}

/**
 * Romance page content component that handles the swiping logic.
 */
function RomancePageContent() {
  const {
    personas,
    remainingSwipes,
    isLoading,
    swipe,
    undo,
  } = useRomanceSwiping();

  const handleSwipe = (userId: string, action: 'like' | 'dislike') => {
    if (personas) {
      swipe(userId as Id<'users'>, action);
    }
  };

  const handleUndo = () => {
    undo();
  };

  return (
    <RomanceSwiper
      personas={personas || []}
      onSwipe={handleSwipe}
      onUndo={handleUndo}
      remainingSwipes={remainingSwipes}
      isLoading={isLoading}
      className="max-w-md mx-auto"
    />
  );
}
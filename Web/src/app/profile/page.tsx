'use client';

/**
 * Profile page component for the EchoinWhispr Web application.
 *
 * This page displays the user's profile information and allows editing when the feature is enabled.
 * The entire page is wrapped with a feature flag check to conditionally render the profile functionality.
 */

import { FEATURE_FLAGS } from '@/config/featureFlags';
import { ProfileScreen } from '@/features/profile';

/**
 * Profile page component.
 *
 * Renders the profile screen if the USER_PROFILE_EDITING feature flag is enabled,
 * otherwise displays a placeholder message.
 */
export default function ProfilePage() {
  if (!FEATURE_FLAGS.USER_PROFILE_EDITING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">
            Feature Not Available
          </h1>
          <p className="text-muted-foreground">
            Profile editing is currently disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <ProfileScreen />
      </main>
    </div>
  );
}
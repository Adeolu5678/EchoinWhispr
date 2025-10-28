'use client';

/**
 * Persona profile page component for the EchoinWhispr Web application.
 *
 * This page displays the persona profile screen if the PERSONA_PROFILES_VERIFICATION
 * feature flag is enabled, otherwise shows a placeholder message.
 */

import { FEATURE_FLAGS } from '@/config/featureFlags';
import { PersonaProfileScreen } from '@/features/profile';

/**
 * Persona profile page component.
 *
 * Renders the persona profile screen if the PERSONA_PROFILES_VERIFICATION feature flag is enabled,
 * otherwise displays a placeholder message.
 */
export default function PersonaProfilePage() {
  if (!FEATURE_FLAGS.PERSONA_PROFILES_VERIFICATION) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground mb-4">
            Feature Not Available
          </h1>
          <p className="text-muted-foreground">
            Persona profiles with verification are currently disabled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <PersonaProfileScreen />
      </main>
    </div>
  );
}
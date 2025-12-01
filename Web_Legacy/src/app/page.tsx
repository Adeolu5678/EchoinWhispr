'use client';

import { useAuth } from '@clerk/nextjs';
import { WhisperFeed } from '@/features/whispers/components/WhisperFeed';
import LandingPage from '@/components/LandingPage';

/**
 * Root page component.
 *
 * Checks authentication status and renders appropriate content.
 * For unauthenticated users, displays the comprehensive landing page.
 * For authenticated users, displays the whisper feed.
 *
 * @returns {JSX.Element} The rendered page
 */
export default function HomePage() {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <LandingPage />;
  }

  return <WhisperFeed />;
}

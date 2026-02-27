'use client';

import { useAuth } from '@clerk/nextjs';
import { Dashboard } from '@/components/Dashboard';
import LandingPage from '@/components/LandingPage';

/**
 * Root page component.
 *
 * Checks authentication status and renders appropriate content.
 * For unauthenticated users, displays the comprehensive landing page.
 * For authenticated users, displays the app dashboard with activity summary.
 *
 * @returns {JSX.Element} The rendered page
 */
export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();

  // Wait for Clerk to finish loading before deciding which page to show.
  // Without this guard the LandingPage flashes briefly for authenticated users
  // because isSignedIn starts as undefined.
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <LandingPage />;
  }

  return <Dashboard />;
}


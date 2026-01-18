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
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <LandingPage />;
  }

  return <Dashboard />;
}


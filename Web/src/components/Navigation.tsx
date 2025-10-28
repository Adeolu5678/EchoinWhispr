'use client';

import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { MenuBar } from './MenuBar';
import { UserMenu } from './UserMenu';

/**
 * Main navigation component for the EchoinWhispr web application.
 *
 * This component provides the primary navigation structure for authenticated users,
 * including a menu bar with dropdown navigation and user menu. It displays the app logo,
 * menu bar, and user menu based on authentication status.
 *
 * Features:
 * - Menu bar with hamburger icon and dropdown menu
 * - Integration with Clerk authentication
 * - Responsive design
 * - Performance optimizations with useCallback
 *
 * @returns {JSX.Element} The rendered navigation component
 */
export const Navigation = () => {
  const { user, isLoaded } = useUser();

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <nav className="bg-primary-600 border-b border-primary-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-primary-700 animate-pulse rounded"></div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-primary-700 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  // Don't render navigation for unauthenticated users
  if (!user) {
    return null;
  }

  return (
    <nav className="bg-primary-600 border-b border-primary-700 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-bold text-inverse hover:text-primary-100 transition-colors"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EW</span>
              </div>
              <span className="hidden sm:block">EchoinWhispr</span>
            </Link>
          </div>

          {/* Menu Bar */}
          <div className="flex items-center">
            <MenuBar />
          </div>

          {/* User Menu */}
          <div className="flex items-center">
            <UserMenu user={user} />
          </div>
        </div>
      </div>
    </nav>
  );
};
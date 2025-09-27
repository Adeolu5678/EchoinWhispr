'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/nextjs';

/**
 * Props for the MobileNavigation component
 */
interface MobileNavigationProps {
  /** User object from Clerk authentication */
  user: ReturnType<typeof useUser>['user'];
  /** Array of navigation items */
  navigationItems: Array<{
    href: string;
    label: string;
    icon: LucideIcon;
    description: string;
  }>;
  /** Function to check if a route is active */
  isActiveRoute: (href: string) => boolean;
  /** Function to close the mobile navigation */
  onClose: () => void;
}

/**
 * Mobile navigation component for the EchoinWhispr web application.
 *
 * This component renders the navigation content for the mobile slide-out menu.
 * It displays navigation links in a mobile-friendly format with proper touch
 * targets and accessibility, along with the user menu.
 *
 * Features:
 * - Touch-friendly navigation items
 * - Active route highlighting
 * - Proper accessibility with ARIA attributes
 * - Performance optimized with useCallback
 *
 * @param props - The component props
 * @returns {JSX.Element} The rendered mobile navigation content
 */
export const MobileNavigation = ({
   user: _user,
   navigationItems,
   isActiveRoute,
   onClose,
}: MobileNavigationProps) => {
  /**
   * Handle navigation link click
   * Uses useCallback for performance optimization
   */
  const handleNavClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <div className="flex-1">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary-700">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EW</span>
          </div>
          <span className="text-lg font-bold text-inverse">
            EchoinWhispr
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map(item => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-700 text-inverse'
                      : 'text-primary-100 hover:text-inverse hover:bg-primary-700'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-primary-200">
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};
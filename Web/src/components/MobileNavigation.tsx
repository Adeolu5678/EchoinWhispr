'use client';

import { useCallback } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Props for the MobileNavigation component
 */
interface MobileNavigationProps {
  /** Whether the mobile navigation is open */
  isOpen: boolean;
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
 * This component provides a slide-out mobile navigation menu that appears
 * when the hamburger menu button is clicked. It displays navigation links
 * in a mobile-friendly format with proper touch targets and accessibility.
 *
 * Features:
 * - Slide-out animation from the left
 * - Touch-friendly navigation items
 * - Active route highlighting
 * - Proper accessibility with ARIA attributes
 * - Backdrop click to close
 * - Performance optimized with useCallback
 *
 * @param props - The component props
 * @returns {JSX.Element} The rendered mobile navigation
 */
export const MobileNavigation = ({
  isOpen,
  navigationItems,
  isActiveRoute,
  onClose,
}: MobileNavigationProps) => {
  /**
   * Handle backdrop click to close menu
   * Uses useCallback for performance optimization
   */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  /**
   * Handle navigation link click
   * Uses useCallback for performance optimization
   */
  const handleNavClick = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Mobile Navigation Menu */}
      <div className="fixed top-0 left-0 bottom-0 w-64 bg-primary-600 z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
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

          {/* Footer */}
          <div className="p-4 border-t border-primary-700">
            <div className="text-xs text-primary-200 text-center">
              EchoinWhispr v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

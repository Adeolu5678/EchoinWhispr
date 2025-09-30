'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Menu, Home, Send, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationLink } from './NavigationLink';
import { UserMenu } from './UserMenu';
import { MobileNavigation } from './MobileNavigation';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

/**
 * Main navigation component for the EchoinWhispr web application.
 *
 * This component provides the primary navigation structure for authenticated users,
 * including desktop and mobile navigation options. It displays the app logo,
 * navigation links, and user menu based on authentication status.
 *
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Integration with Clerk authentication
 * - Active route highlighting
 * - Mobile-first approach with collapsible navigation
 * - Performance optimizations with React.memo and useCallback
 *
 * @returns {JSX.Element} The rendered navigation component
 */
export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  /**
   * Close mobile menu
   * Uses useCallback for performance optimization
   */
  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  /**
   * Navigation items configuration
   * Memoized to prevent unnecessary re-renders
   */
  const navigationItems = useMemo(
    () => [
      {
        href: '/',
        label: 'Home',
        icon: Home,
        description: 'View received whispers and home feed',
      },
      {
        href: '/compose',
        label: 'Compose',
        icon: Send,
        description: 'Create and send new whispers',
      },
      {
        href: '/inbox',
        label: 'Inbox',
        icon: Inbox,
        description: 'View all received whispers',
      },
    ],
    []
  );

  /**
   * Check if current path matches navigation item
   * Uses useCallback for performance optimization
   */
  const isActiveRoute = useCallback(
    (href: string) => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

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
              onClick={closeMobileMenu}
            >
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">EW</span>
              </div>
              <span className="hidden sm:block">EchoinWhispr</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map(item => (
              <NavigationLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActiveRoute(item.href)}
                onClick={closeMobileMenu}
              />
            ))}
          </div>

          {/* User Menu and Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <UserMenu user={user} />

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col">
                <MobileNavigation
                  user={user}
                  navigationItems={navigationItems}
                  isActiveRoute={isActiveRoute}
                  onClose={closeMobileMenu}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
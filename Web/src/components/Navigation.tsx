'use client';

import { useCallback, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Home, Send, Inbox, Users, 
  Compass, Radio, Lightbulb, BarChart3 
} from 'lucide-react';
import { NavigationLink } from './NavigationLink';
import { UserMenu } from './UserMenu';
import { NotificationBell } from './NotificationBell';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { Logo } from './Logo';

/**
 * Main navigation component for the EchoinWhispr web application.
 *
 * Features:
 * - Premium glass morphism styling with gradient accents
 * - Responsive design
 * - Animated logo with glow effect
 * - Active route highlighting with glow indicators
 * - Integration with Clerk authentication
 */
export const Navigation = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  /**
   * Primary navigation items - shown directly in header
   */
  const primaryNavItems = useMemo(() => [
    {
      href: '/',
      label: 'Home',
      icon: Home,
      description: 'View received whispers and home feed',
    },
    {
      href: '/discover',
      label: 'Discover',
      icon: Compass,
      description: 'Find new connections based on interests',
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
  ], []);

  /**
   * Secondary navigation items - shown in UserMenu dropdown
   */
  const secondaryNavItems = useMemo(() => {
    const items = [
      {
        href: '/chambers',
        label: 'Chambers',
        icon: Radio,
        description: 'Anonymous group conversations',
      },
      {
        href: '/skills',
        label: 'Skills',
        icon: Lightbulb,
        description: 'Teach and learn from others',
      },
      {
        href: '/insights',
        label: 'Insights',
        icon: BarChart3,
        description: 'View your connection analytics',
      },
    ];

    if (FEATURE_FLAGS.FRIENDS) {
      items.push({
        href: '/friends',
        label: 'Friends',
        icon: Users,
        description: 'Manage your friends and friend requests',
      });
    }

    // Note: Profile and Settings are hardcoded in UserMenu, not here
    // to avoid duplicates

    return items;
  }, []);

  /**
   * Check if current path matches navigation item
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

  // Loading state
  if (!isLoaded) {
    return (
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-9 w-9 bg-primary/20 animate-pulse rounded-lg" />
              <div className="h-6 w-28 bg-primary/20 animate-pulse rounded ml-2 hidden sm:block" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-9 w-9 bg-primary/20 animate-pulse rounded-full" />
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
    <nav className="fixed top-0 w-full z-50 glass md:glass border-b border-white/5 bg-background/90 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo size="sm" />
          </div>

          {/* Desktop Navigation - Primary items only */}
          <div className="hidden md:flex items-center gap-1">
            {primaryNavItems.map(item => (
              <NavigationLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActiveRoute(item.href)}
              />
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserMenu user={user} secondaryNavItems={secondaryNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
};
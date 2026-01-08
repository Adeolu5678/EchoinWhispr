'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Menu, Home, Send, Inbox, Users, User, Sparkles, 
  Settings as SettingsIcon, Compass, Radio, Lightbulb, BarChart3 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NavigationLink } from './NavigationLink';
import { UserMenu } from './UserMenu';
import { MobileNavigation } from './MobileNavigation';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { FEATURE_FLAGS } from '@/config/featureFlags';

/**
 * Main navigation component for the EchoinWhispr web application.
 *
 * Features:
 * - Premium glass morphism styling with gradient accents
 * - Responsive design with mobile hamburger menu
 * - Animated logo with glow effect
 * - Active route highlighting with glow indicators
 * - Integration with Clerk authentication
 */
export const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  /**
   * Navigation items configuration
   */
  const navigationItems = useMemo(() => {
    const baseItems = [
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
        href: '/chambers',
        label: 'Chambers',
        icon: Radio,
        description: 'Anonymous group conversations',
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
      baseItems.push({
        href: '/friends',
        label: 'Friends',
        icon: Users,
        description: 'Manage your friends and friend requests',
      });
    }

    if (FEATURE_FLAGS.USER_PROFILE_EDITING) {
      baseItems.push({
        href: '/profile',
        label: 'Profile',
        icon: User,
        description: 'Edit your profile information',
      });

      baseItems.push({
        href: '/settings',
        label: 'Settings',
        icon: SettingsIcon,
        description: 'Manage your preferences',
      });
    }

    return baseItems;
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
            <Link
              href="/"
              className="flex items-center gap-2 group"
              onClick={closeMobileMenu}
            >
              <div className="relative bg-gradient-to-br from-primary to-accent p-2 rounded-lg shadow-glow-sm group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold tracking-tight hidden sm:block group-hover:text-gradient transition-all duration-300">
                EchoinWhispr
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
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
          <div className="flex items-center gap-3">
            <UserMenu user={user} />

            {/* Mobile menu button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden hover:bg-white/5 h-11 w-11 touch-target"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 glass border-r border-white/5 p-0">
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
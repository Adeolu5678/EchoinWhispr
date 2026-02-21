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

export const Navigation = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

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

    return items;
  }, []);

  const isActiveRoute = useCallback(
    (href: string) => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  if (!isLoaded) {
    return (
      <nav className="fixed top-0 w-full z-50">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-transparent backdrop-blur-xl" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

  if (!user) {
    return null;
  }

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="absolute inset-0 glass" />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="absolute -left-32 top-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-30 animate-float-slow pointer-events-none" />
      <div className="absolute -right-32 top-1/2 w-48 h-48 bg-accent/15 rounded-full blur-3xl opacity-20 animate-float-slow animation-delay-2000 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo size="sm" />
          </div>

          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-white/5 backdrop-blur-sm border border-white/5">
            {primaryNavItems.map((item, index) => (
              <NavigationLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                isActive={isActiveRoute(item.href)}
                index={index}
              />
            ))}
          </div>

          <div className="flex items-center gap-3">
            <NotificationBell />
            <UserMenu user={user} secondaryNavItems={secondaryNavItems} />
          </div>
        </div>
      </div>
    </nav>
  );
};
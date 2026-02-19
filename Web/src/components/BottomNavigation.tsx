'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { 
  Home, Send, Inbox, Radio, User, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FEATURE_FLAGS } from '@/config/featureFlags';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isPrimary?: boolean;
}

export const BottomNavigation = () => {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const isActiveRoute = useCallback(
    (href: string) => {
      if (href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(href);
    },
    [pathname]
  );

  const navigationItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [
      {
        href: '/',
        label: 'Home',
        icon: Home,
      },
      {
        href: '/inbox',
        label: 'Inbox',
        icon: Inbox,
      },
      {
        href: '/compose',
        label: 'Compose',
        icon: Plus,
        isPrimary: true,
      },
      {
        href: '/chambers',
        label: 'Chambers',
        icon: Radio,
      },
    ];

    if (FEATURE_FLAGS.USER_PROFILE_EDITING) {
      items.push({
        href: '/profile',
        label: 'Profile',
        icon: User,
      });
    } else {
      items.push({
        href: '/discover',
        label: 'Discover',
        icon: Send,
      });
    }

    return items;
  }, []);

  if (!isLoaded || !user) {
    return null;
  }

  const primaryItem = navigationItems.find(item => item.isPrimary);
  const regularItems = navigationItems.filter(item => !item.isPrimary);

  return (
    <>
      {/* Floating Compose Button - positioned above the nav */}
      {primaryItem && (
        <Link
          href={primaryItem.href}
          className="fixed left-1/2 -translate-x-1/2 z-[60] md:hidden group"
          style={{ bottom: 'calc(0.5rem + 3.5rem + 0.25rem)' }}
          aria-label={primaryItem.label}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            {/* Button */}
            <div 
              className={cn(
                "relative flex items-center justify-center w-14 h-14 rounded-full",
                "bg-gradient-to-br from-primary via-primary to-accent",
                "shadow-xl shadow-primary/50",
                "transition-all duration-300",
                "group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-primary/60",
                "group-active:scale-95",
                "motion-safe:pulse-glow"
              )}
            >
              <Plus className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
          </div>
          {/* Label */}
          <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground group-hover:text-white transition-colors whitespace-nowrap">
            {primaryItem.label}
          </span>
        </Link>
      )}

      {/* Bottom Navigation Bar */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="absolute inset-0 glass" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="relative flex items-center justify-around h-14 px-4">
          {regularItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center",
                  "py-1.5 px-2 rounded-xl",
                  "transition-all duration-300 ease-out",
                  "group relative",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-white"
                )}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20" />
                    <div className="absolute -inset-1 rounded-xl bg-primary/10 blur-md opacity-50 motion-reduce:hidden" />
                  </>
                )}
                
                <div 
                  className={cn(
                    "relative flex items-center justify-center w-9 h-9 rounded-xl",
                    "transition-all duration-300",
                    "group-hover:scale-105",
                    isActive && "bg-gradient-to-br from-primary/25 to-accent/15 shadow-md shadow-primary/20"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive && "text-primary drop-shadow-[0_0_6px_rgba(0,163,255,0.5)]",
                    !isActive && "group-hover:text-primary group-hover:drop-shadow-[0_0_4px_rgba(0,163,255,0.3)]"
                  )} />
                </div>
                
                <span className={cn(
                  "relative z-10 text-[10px] font-medium mt-0.5 transition-all duration-300",
                  isActive && "text-primary"
                )}>
                  {item.label}
                </span>
                
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-primary to-accent shadow-[0_0_8px_rgba(0,163,255,0.6)]" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

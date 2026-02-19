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

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden safe-bottom overflow-x-hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="absolute inset-0 glass" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="absolute left-4 bottom-full w-32 h-32 bg-primary/10 rounded-full blur-3xl opacity-30 motion-safe:animate-float-slow pointer-events-none max-md:hidden" />
      <div className="absolute right-4 bottom-full w-24 h-24 bg-accent/10 rounded-full blur-3xl opacity-20 motion-safe:animate-float-slow animation-delay-1000 pointer-events-none max-md:hidden" />
      
      <div className="relative flex items-center justify-around h-16 px-2">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-6 group"
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
                  <div 
                    className={cn(
                      "relative flex items-center justify-center w-14 h-14 rounded-full",
                      "bg-gradient-to-br from-primary via-primary to-accent",
                      "shadow-lg shadow-primary/40",
                      "transition-all duration-300",
                      "group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/50",
                      "group-active:scale-95",
                      "motion-safe:pulse-glow"
                    )}
                  >
                    <Icon className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                </div>
                <span className="text-[10px] font-medium mt-1.5 text-muted-foreground group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center",
                "touch-target py-2 px-3 rounded-xl",
                "transition-all duration-300 ease-out",
                "group relative",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-white"
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {isActive && (
                <>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20" />
                  <div className="absolute -inset-1 rounded-xl bg-primary/10 blur-md opacity-50 motion-reduce:hidden" />
                </>
              )}
              
              <div 
                className={cn(
                  "relative flex items-center justify-center w-10 h-10 rounded-xl",
                  "transition-all duration-300",
                  "group-hover:scale-110",
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
  );
};
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

import { useUser } from '@clerk/nextjs';

export function BottomNav() {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/projects', label: 'Projects', icon: Briefcase },
    { href: '/conversations', label: 'Messages', icon: MessageSquare },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  if (!isLoaded) return null;

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[320px]">
      <div className="glass-panel rounded-full shadow-2xl shadow-black/50 flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          // If user is not logged in, redirect to sign-in with redirect_url
          const href = user ? item.href : `/sign-in?redirect_url=${encodeURIComponent(item.href)}`;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all duration-200',
                isActive ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(0,163,255,0.3)]' : 'text-neutral-400 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'fill-current')} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

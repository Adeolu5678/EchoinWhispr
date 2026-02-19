'use client';

import { forwardRef, useCallback } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  index?: number;
}

export const NavigationLink = forwardRef<
  HTMLAnchorElement,
  NavigationLinkProps
>(({ href, icon: Icon, label, isActive, onClick, index = 0 }, ref) => {
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <Link
      href={href}
      onClick={handleClick}
      ref={ref}
      aria-current={isActive ? 'page' : undefined}
      aria-label={label}
      className={cn(
        "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
        "transition-all duration-300 ease-out",
        "hover:scale-105",
        isActive && [
          "bg-gradient-to-r from-primary/20 via-primary/15 to-accent/10",
          "text-white",
          "shadow-lg shadow-primary/20",
        ],
        !isActive && [
          "text-muted-foreground hover:text-white",
          "hover:bg-white/5",
        ]
      )}
      style={{
        animationDelay: `${index * 50}ms`,
      }}
    >
      {isActive && (
        <>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-accent opacity-20 blur-sm" />
          <div className="absolute inset-0 rounded-lg border border-primary/30" />
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 blur-md opacity-50" />
        </>
      )}
      
      <Icon className={cn(
        "relative z-10 h-4 w-4 transition-all duration-300",
        isActive && "text-primary drop-shadow-[0_0_8px_rgba(0,163,255,0.5)]"
      )} />
      <span className="relative z-10 hidden sm:inline">{label}</span>
      
      {isActive && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(0,163,255,0.8)]" />
      )}
    </Link>
  );
});

NavigationLink.displayName = 'NavigationLink';
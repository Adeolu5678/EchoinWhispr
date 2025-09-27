'use client';

import { forwardRef, useCallback } from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Props for the NavigationLink component
 */
interface NavigationLinkProps {
  /** The URL to navigate to */
  href: string;
  /** The icon component to display */
  icon: LucideIcon;
  /** The text label for the navigation item */
  label: string;
  /** Whether this navigation item is currently active */
  isActive: boolean;
  /** Optional click handler for additional functionality */
  onClick?: () => void;
}

/**
 * Individual navigation link component for the main navigation.
 *
 * This component provides consistent styling and behavior for navigation links
 * throughout the application. It supports active state highlighting and
 * optional click handlers for mobile menu interactions.
 *
 * Features:
 * - Active route highlighting with visual feedback
 * - Consistent hover and focus states
 * - Accessible design with proper ARIA attributes
 * - Performance optimized with forwardRef
 * - Mobile-friendly touch targets
 *
 * @param props - The component props
 * @returns {JSX.Element} The rendered navigation link
 */
export const NavigationLink = forwardRef<
  HTMLAnchorElement,
  NavigationLinkProps
>(({ href, icon: Icon, label, isActive, onClick }, ref) => {
  /**
   * Handle click events with optional callback
   * Uses useCallback for performance optimization
   */
  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <Link href={href} onClick={handleClick} ref={ref}>
      <Button
        variant={isActive ? 'secondary' : 'ghost'}
        size="sm"
        className={`
            flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors
            ${
              isActive
                ? 'bg-primary-700 text-primary-foreground'
                : 'text-primary-foreground hover:bg-primary-700'
            }
          `}
        aria-current={isActive ? 'page' : undefined}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </Button>
    </Link>
  );
});

// Set display name for better debugging
NavigationLink.displayName = 'NavigationLink';

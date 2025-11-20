'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useClerk } from '@clerk/nextjs';
import { User, Settings, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/features/subscription/hooks/useSubscription';
import { SubscriptionModal } from '@/features/subscription/components/SubscriptionModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

/**
 * Props for the UserMenu component
 */
interface UserMenuProps {
  /** The authenticated user object from Clerk */
  user: ReturnType<typeof useUser>['user'];
}

/**
 * User menu component providing user avatar, profile access, and sign-out functionality.
 *
 * This component displays the user's avatar and provides a dropdown menu with
 * user-related actions including profile access and sign-out functionality.
 * It integrates with Clerk for authentication management.
 *
 * Features:
 * - User avatar with fallback initials
 * - Dropdown menu with user actions
 * - Integration with Clerk authentication
 * - Loading states and error handling
 * - Accessible design with proper ARIA attributes
 * - Performance optimized with useCallback
 *
 * @param props - The component props
 * @returns {JSX.Element} The rendered user menu
 */
export const UserMenu = ({ user }: UserMenuProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const { signOut } = useClerk();

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
  const { isFeatureEnabled, isPremium } = useSubscription();

  /**
   * Handle user sign out
   * Uses useCallback for performance optimization
   */
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
      // Error handling could be enhanced with toast notifications
    }
  }, [signOut, router]);

  /**
   * Handle menu open/close state
   * Uses useCallback for performance optimization
   */
  const handleMenuToggle = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  /**
   * Get user initials for avatar fallback
   * Uses useCallback for performance optimization
   */
  const getUserInitials = useCallback(() => {
    if (!user) return 'U';

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }

    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }

    if (lastName) {
      return lastName.charAt(0).toUpperCase();
    }

    // Fallback to first letter of email or username
    const email = user.emailAddresses?.[0]?.emailAddress || '';
    const username = user.username || '';

    return (email.charAt(0) || username.charAt(0) || 'U').toUpperCase();
  }, [user]);

  /**
   * Get user display name
   * Uses useCallback for performance optimization
   */
  const getDisplayName = useCallback(() => {
    if (!user) return 'User';

    const firstName = user.firstName || '';
    const lastName = user.lastName || '';

    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }

    if (firstName) {
      return firstName;
    }

    if (lastName) {
      return lastName;
    }

    return user.username || user.emailAddresses?.[0]?.emailAddress || 'User';
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={handleMenuToggle}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 px-2 py-2 h-auto"
            aria-label="User menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.imageUrl} alt={getDisplayName()} />
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-inverse text-sm font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline text-sm font-medium text-inverse">
              {getDisplayName()}
            </span>
            <ChevronDown className="h-4 w-4 text-inverse" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium text-gray-900">
              {getDisplayName()}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.emailAddresses?.[0]?.emailAddress}
            </p>
          </div>

          <DropdownMenuSeparator />

          {isFeatureEnabled && !isPremium && (
            <>
              <DropdownMenuItem
                className="flex items-center space-x-2 cursor-pointer text-primary font-medium"
                onClick={() => setIsSubscriptionModalOpen(true)}
              >
                <Sparkles className="h-4 w-4" />
                <span>Upgrade to Premium</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/profile')}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/settings')}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="flex items-center space-x-2 cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SubscriptionModal 
        isOpen={isSubscriptionModalOpen} 
        onClose={() => setIsSubscriptionModalOpen(false)} 
      />
    </>
  );
};

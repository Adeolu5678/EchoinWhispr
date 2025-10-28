'use client';

import { useState, useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Home, Send, Inbox, MessageCircle, Users, User, Shield, Coins, Vote, Heart, Rss, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FEATURE_FLAGS } from '@/config/featureFlags';

/**
 * MenuBar component that provides a hamburger menu with dropdown navigation.
 *
 * This component displays a menu button that opens a dropdown containing all available app pages.
 * It includes click handlers for navigation and closes the menu after selection.
 * The menu items are conditionally shown based on feature flags.
 *
 * @returns {JSX.Element} The rendered MenuBar component
 */
export const MenuBar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Close the dropdown menu
   */
  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Handle navigation to a page and close the menu
   */
  const handleNavigate = useCallback((href: string) => {
    router.push(href);
    closeMenu();
  }, [router, closeMenu]);

  /**
   * Navigation items configuration with logical grouping
   * Memoized to prevent unnecessary re-renders
   */
  const navigationItems = useMemo(() => [
    // Core Features
    {
      href: '/',
      label: 'Home',
      icon: Home,
      description: 'Landing Page',
      enabled: true,
      group: 'Core',
    },
    {
      href: '/compose',
      label: 'Compose',
      icon: Send,
      description: 'Whisper Composer',
      enabled: true,
      group: 'Core',
    },
    {
      href: '/inbox',
      label: 'Inbox',
      icon: Inbox,
      description: 'Whisper Inbox',
      enabled: true,
      group: 'Core',
    },
    {
      href: '/conversations',
      label: 'Conversations',
      icon: MessageCircle,
      description: 'Echo Conversations',
      enabled: FEATURE_FLAGS.CONVERSATION_EVOLUTION,
      group: 'Core',
    },
    {
      href: '/whispers',
      label: 'Whispers',
      icon: Rss,
      description: 'Whisper Feed',
      enabled: true,
      group: 'Core',
    },

    // Social Features - Friends
    {
      href: '/friends',
      label: 'Friends',
      icon: Users,
      description: 'Friend Management',
      enabled: FEATURE_FLAGS.FRIENDS,
      group: 'Friends',
    },

    // Social Features - Matches
    {
      href: '/matches',
      label: 'Matches',
      icon: Heart,
      description: 'Interest Matching',
      enabled: FEATURE_FLAGS.INTEREST_BASED_MATCHING,
      group: 'Matches',
    },
    {
      href: '/mood-match',
      label: 'Mood Match',
      icon: Smile,
      description: 'Mood-Based Connections',
      enabled: FEATURE_FLAGS.MOOD_BASED_CONNECTIONS,
      group: 'Matches',
    },
    {
      href: '/romance',
      label: 'Romance',
      icon: Heart,
      description: 'Romantic Connections',
      enabled: FEATURE_FLAGS.TINDER_LIKE_SWIPING_FOR_ROMANCE,
      group: 'Matches',
    },
    {
      href: '/my-matches',
      label: 'My Matches',
      icon: Heart,
      description: 'Mutual Matches',
      enabled: FEATURE_FLAGS.MUTUAL_MATCHING_SYSTEM,
      group: 'Matches',
    },

    // Profile Features
    {
      href: '/profile',
      label: 'Profile',
      icon: User,
      description: 'User Profile',
      enabled: FEATURE_FLAGS.USER_PROFILE_EDITING,
      group: 'Profile',
    },
    {
      href: '/profile/persona',
      label: 'Persona',
      icon: Shield,
      description: 'Persona Profile',
      enabled: FEATURE_FLAGS.PERSONA_PROFILES_VERIFICATION,
      group: 'Profile',
    },
    {
      href: '/profile/tokens',
      label: 'Tokens',
      icon: Coins,
      description: 'Token Management',
      enabled: FEATURE_FLAGS.TOKENIZED_WHISPER_REWARDS_AND_TIPPING,
      group: 'Profile',
    },
    {
      href: '/profile/governance',
      label: 'Governance',
      icon: Vote,
      description: 'Community Governance',
      enabled: FEATURE_FLAGS.HEDERA_POWERED_ANONYMOUS_COMMUNITY_GOVERNANCE,
      group: 'Profile',
    },
  ], []);

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

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="p-2 text-primary-text hover:text-primary-100 transition-colors"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 bg-primary-700 border-primary-600 shadow-lg"
        sideOffset={8}
      >
        {navigationItems
          .filter(item => item.enabled)
          .map(item => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);

            return (
              <DropdownMenuItem
                key={item.href}
                className={`flex items-center space-x-3 px-4 py-3 cursor-pointer hover:bg-primary-600 transition-colors ${
                  isActive ? 'bg-primary-600 text-primary-100' : 'text-primary-text'
                }`}
                onClick={() => handleNavigate(item.href)}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-secondary-text">{item.description}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
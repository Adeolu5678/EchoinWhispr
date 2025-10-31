'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Heart, Inbox, User } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Get the current page title based on pathname
  const getPageTitle = () => {
    if (pathname.includes('/search')) return 'Search';
    if (pathname.includes('/whispers')) return 'Mood Match';
    if (pathname.includes('/conversations')) return 'Inbox';
    if (pathname.includes('/profile')) return 'My Persona';
    return 'Dashboard';
  };

  // Navigation items
  const navItems = [
    {
      href: '/search',
      icon: Search,
      label: 'Search',
      active: pathname.includes('/search'),
    },
    {
      href: '/whispers',
      icon: Heart,
      label: 'Mood Match',
      active: pathname.includes('/whispers'),
    },
    {
      href: '/conversations',
      icon: Inbox,
      label: 'Inbox',
      active: pathname.includes('/conversations'),
    },
    {
      href: '/profile',
      icon: User,
      label: 'My Persona',
      active: pathname.includes('/profile'),
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col">
      {/* Header Bar */}
      <header className="bg-neutral-800 border-b border-neutral-700 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-100">{getPageTitle()}</h1>
          <div className="text-neutral-400 text-sm">
            Daily Whispers Left: <span className="font-bold text-primary-500 text-base">5</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 bg-neutral-900">
        {children}
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="bg-neutral-800 border-t border-neutral-700">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center justify-center py-3 px-2 transition-colors ${
                  item.active
                    ? 'text-primary-500'
                    : 'text-neutral-400 hover:text-neutral-300'
                }`}
              >
                <Icon
                  size={20}
                  className={`mb-1 ${item.active ? 'fill-current' : ''}`}
                />
                {item.active && (
                  <span className="text-xs font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;
'use client';

import { useAuth, useUser, SignOutButton } from '@clerk/nextjs';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';

export function UserMenu() {
  const { user: clerkUser } = useUser();
  const convexUser = useQuery(api.users.getCurrentUser);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!clerkUser) return null;

  const user = convexUser ? {
    ...convexUser,
    id: convexUser._id,
    name: convexUser.username || clerkUser.fullName,
    email: convexUser.email || clerkUser.primaryEmailAddress?.emailAddress,
    avatarUrl: convexUser.avatarUrl || clerkUser.imageUrl,
  } : { 
    id: clerkUser.id,
    name: clerkUser.fullName, 
    email: clerkUser.primaryEmailAddress?.emailAddress,
    avatarUrl: clerkUser.imageUrl,
  };

  const displayName = user.name;
  const email = user.email;
  const avatarUrl = user.avatarUrl;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
      >
        <img
          src={avatarUrl}
          alt={displayName || 'User'}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
        />
        <span className="text-sm font-medium text-slate-200 hidden md:block">
          {displayName}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl shadow-black/50 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="px-4 py-3 border-b border-white/5 mb-2">
            <p className="text-sm font-medium text-white">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{email}</p>
          </div>
          
          <Link
            href={`/profile/${user.id}`}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <User className="w-4 h-4" />
            Profile
          </Link>
          
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          
          <div className="border-t border-white/5 my-1"></div>
          
          <SignOutButton>
            <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}

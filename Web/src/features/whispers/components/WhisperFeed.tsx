import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { WhisperList } from './WhisperList';

export const WhisperFeed: React.FC = () => {
  return (
    <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark px-4 sm:px-10 py-3">
          <div className="flex items-center gap-4 text-gray-800 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-gray-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">EchoinWhispr</h2>
          </div>
          <Link href="/compose">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              <span className="truncate">New Whisper</span>
            </button>
          </Link>
        </header>
        <main className="flex-1 mt-8">
          <div className="bg-background-light dark:bg-card-dark rounded-xl shadow-lg">
            <WhisperList showMarkAsRead />
          </div>
        </main>
      </div>
    </div>
  );
};
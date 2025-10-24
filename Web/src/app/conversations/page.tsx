'use client';

import { ConversationList } from '@/features/conversations/components/ConversationList';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useGetConversations } from '@/features/conversations/hooks/useGetConversations';
import type { Id } from '@/lib/convex';
import { ArrowLeft } from 'lucide-react';

export default function ConversationsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { conversations, isLoading, error } = useGetConversations();
  const currentUserId = user?.id as Id<'users'>;

  if (!FEATURE_FLAGS.CONVERSATION_EVOLUTION) {
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
                    <div className="flex flex-1 justify-end gap-4 sm:gap-8">
                        <button
                            onClick={() => router.back()}
                            className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 dark:bg-border-dark text-gray-800 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                        >
                            <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                        </button>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                            style={{ backgroundImage: `url(${user?.imageUrl})` }}
                        ></div>
                    </div>
                </header>
                <main className="flex-1 mt-8">
                    <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 flex items-center gap-3">
                        <span className="material-symbols-outlined">error</span>
                        <p>This feature is currently disabled.</p>
                    </div>
                </main>
            </div>
        </div>
    );
  }

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
                    <h2 className="text-gray-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Conversations</h2>
                </div>
                <div className="flex flex-1 justify-end gap-4 sm:gap-8">
                    <button
                        onClick={() => router.back()}
                        className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 dark:bg-border-dark text-gray-800 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
                    </button>
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                        style={{ backgroundImage: `url(${user?.imageUrl})` }}
                    ></div>
                </div>
            </header>
            <main className="flex-1 mt-8">
                <ConversationList
                    conversations={conversations}
                    isLoading={isLoading}
                    error={error}
                    currentUserId={currentUserId}
                />
            </main>
        </div>
    </div>
  );
}
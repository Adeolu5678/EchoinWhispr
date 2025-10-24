'use client';

import { Suspense } from 'react';
import { WhisperComposer } from '@/features/whispers/components/WhisperComposer';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const ComposePageSkeleton = () => (
    <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1 animate-pulse">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark px-4 sm:px-10 py-3">
                <div className="flex items-center gap-4">
                    <div className="size-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex flex-1 justify-end gap-4 sm:gap-8">
                    <div className="h-10 w-12 bg-gray-300 dark:bg-border-dark rounded-lg"></div>
                    <div className="size-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                </div>
            </header>
            <main className="flex-1 mt-8">
                <div className="p-4">
                    <div className="bg-background-light dark:bg-card-dark rounded-xl shadow-lg">
                        <div className="p-6 flex flex-col gap-4">
                            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                            <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded float-right mr-6 mb-3"></div>
                    </div>
                </div>
            </main>
        </div>
    </div>
);

export default function ComposePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  if (!isLoaded || !user) {
    return <ComposePageSkeleton />;
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
                <Suspense fallback={<ComposePageSkeleton />}>
                    <WhisperComposer
                        onWhisperSent={() => router.push('/inbox')}
                        placeholder="Type your whisper here..."
                    />
                </Suspense>
            </main>
        </div>
    </div>
  );
}
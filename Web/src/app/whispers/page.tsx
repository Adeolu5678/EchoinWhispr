'use client';

import { Suspense } from 'react';
import { WhisperFeed } from '@/features/whispers/components/WhisperFeed';

/**
 * Whispers page component that displays the main whisper feed.
 *
 * This page serves as the central hub for viewing all whispers in the application.
 * It uses the WhisperFeed component to render the list of whispers with proper
 * loading states and error handling.
 *
 * @returns {JSX.Element} The rendered Whispers page
 */
export default function WhispersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-primary-text mb-6">Whispers</h1>
        <Suspense fallback={<div className="text-center py-8">Loading whispers...</div>}>
          <WhisperFeed />
        </Suspense>
      </div>
    </div>
  );
}
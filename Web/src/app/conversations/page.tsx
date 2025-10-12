'use client';

import { FEATURE_FLAGS } from '@/config/featureFlags';
import { ConversationList } from '@/features/conversations/components/ConversationList';

/**
 * Conversations page - displays a list of active conversations.
 * This page is only accessible when the CONVERSATION_EVOLUTION feature flag is enabled.
 */
export default function ConversationsPage() {
  if (!FEATURE_FLAGS.CONVERSATION_EVOLUTION) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature Not Available</h1>
          <p className="text-gray-600">This feature is currently disabled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversations</h1>
        <p className="text-gray-600">Your active two-way conversations</p>
      </div>

      <ConversationList />
    </div>
  );
}
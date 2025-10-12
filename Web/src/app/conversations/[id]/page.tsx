'use client';

import { FEATURE_FLAGS } from '@/config/featureFlags';
import { ConversationView } from '@/features/conversations/components/ConversationView';

/**
 * Individual conversation page - displays a specific conversation.
 * This page is only accessible when the CONVERSATION_EVOLUTION feature flag is enabled.
 */
export default function ConversationPage({ params }: { params: { id: string } }) {
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
      <ConversationView conversationId={params.id} />
    </div>
  );
}
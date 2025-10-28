import React from 'react';
import { FEATURE_FLAGS } from '@/config/featureFlags';

interface RandomMessagingProps {
  messageCount?: number;
  onSendRandomMessage?: () => void;
}

export const RandomMessaging: React.FC<RandomMessagingProps> = ({
  messageCount = 0,
  onSendRandomMessage,
}) => {
  if (!FEATURE_FLAGS.RANDOM_ANONYMOUS_MESSAGING) {
    return null;
  }

  return (
    <div className="p-4 bg-background-light dark:bg-card-dark rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Random Anonymous Messaging
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Messages sent: {messageCount}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Send anonymous messages to random users through equitable distribution.
        </p>

        <button
          disabled
          className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg cursor-not-allowed"
          onClick={onSendRandomMessage}
        >
          Send Random Message (Coming Soon)
        </button>
      </div>
    </div>
  );
};
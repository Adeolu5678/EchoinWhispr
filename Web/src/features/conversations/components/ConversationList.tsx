import { ConversationCard } from './ConversationCard';
import type { Id } from '@/lib/convex';
import type { Conversation } from '../types';

interface ConversationListProps {
  conversations: Conversation[] | undefined;
  isLoading: boolean;
  error: Error | null;
  currentUserId: Id<'users'>;
  onRefresh?: () => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  isLoading,
  error,
  currentUserId,
  onRefresh: _onRefresh,
}) => {

  if (isLoading) {
    return (
        <div className="p-4">
            <div className="bg-background-light dark:bg-card-dark rounded-xl shadow-lg p-6 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="ml-4 text-gray-700 dark:text-gray-300">Loading conversations...</span>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-4">
            <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg p-6 flex items-center gap-3">
                <span className="material-symbols-outlined">error</span>
                <p>{error.message || 'An error occurred while loading your conversations.'}</p>
            </div>
        </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
        <div className="p-4">
            <div className="bg-background-light dark:bg-card-dark rounded-xl shadow-lg p-10 text-center">
                <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500">forum</span>
                <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">No conversations yet</h3>
                <p className="mt-2 text-base text-gray-700 dark:text-gray-300">When you accept an echo request, your conversation will appear here.</p>
            </div>
        </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {conversations.map((conversation) => (
        <ConversationCard
          key={conversation._id}
          conversation={conversation}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  );
};
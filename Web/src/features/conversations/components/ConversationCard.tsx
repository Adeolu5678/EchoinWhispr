import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { Id } from '@/lib/convex';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { MessageSquare } from 'lucide-react';

interface ConversationCardProps {
  conversation: {
    _id: Id<'conversations'>;
    participantIds: Id<'users'>[];
    status: 'initiated' | 'active' | 'closed';
    updatedAt: number;
    initialWhisperId?: Id<'whispers'>;
  };
  currentUserId: Id<'users'>;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  currentUserId,
}) => {
  if (!currentUserId) {
    return null;
  }

  const otherParticipantId = conversation.participantIds.find(
    (id) => id !== currentUserId
  );

  if (!otherParticipantId) {
    return null;
  }

  const displayName = `User ${otherParticipantId.slice(-4)}`;

  const conversationName = FEATURE_FLAGS.CONVERSATION_EVOLUTION && conversation.initialWhisperId
    ? `${conversation.initialWhisperId.slice(-4)}...`
    : displayName;

  const statusStyles = {
    initiated: {
      label: 'Initiated',
      icon: 'hourglass_top',
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    active: {
      label: 'Active',
      icon: 'forum',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    closed: {
      label: 'Closed',
      icon: 'cancel',
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-gray-700/30',
    },
  }[conversation.status];

  return (
    <Link href={`/conversations/${conversation._id}`} className="block w-full">
        <div className="bg-background-light dark:bg-card-dark rounded-xl shadow-lg hover:shadow-primary/20 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <p className="text-lg font-bold text-gray-800 dark:text-white truncate">{conversationName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Conversation started</p>
                    </div>
                    <div className={`flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles.bg} ${statusStyles.color}`}>
                        {statusStyles.icon === 'forum' ? (
                            <MessageSquare className="w-4 h-4" />
                        ) : (
                            <span className="material-symbols-outlined text-base">{statusStyles.icon}</span>
                        )}
                        <span>{statusStyles.label}</span>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">schedule</span>
                        <span>{formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}</span>
                    </div>
                </div>
            </div>
        </div>
    </Link>
  );
};
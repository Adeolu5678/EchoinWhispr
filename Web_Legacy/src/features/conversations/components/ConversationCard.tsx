import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import type { Id } from '@/lib/convex';
import { MessageSquare, Briefcase, User } from 'lucide-react';

interface ConversationCardProps {
  conversation: {
    _id: Id<'conversations'>;
    participantIds: Id<'users'>[];
    type: 'direct' | 'workspace_general' | 'interview';
    updatedAt: number;
    workspaceId?: Id<'workspaces'>;
  };
  currentUserId: Id<'users'>;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
  conversation,
  currentUserId,
}) => {
  const otherParticipantId = conversation.participantIds.find(
    (id) => id !== currentUserId
  );

  const typeConfig = {
    direct: {
      label: 'Direct Message',
      icon: User,
      color: 'text-blue-400',
      bg: 'bg-blue-900/20',
    },
    workspace_general: {
      label: 'Workspace',
      icon: Briefcase,
      color: 'text-purple-400',
      bg: 'bg-purple-900/20',
    },
    interview: {
      label: 'Interview',
      icon: MessageSquare,
      color: 'text-emerald-400',
      bg: 'bg-emerald-900/20',
    },
  }[conversation.type];

  const Icon = typeConfig.icon;

  return (
    <Link href={`/conversations/${conversation._id}`} className="block w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-indigo-500/50 transition-colors">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeConfig.bg} ${typeConfig.color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-medium text-white">
                            {conversation.type === 'workspace_general' ? 'Team Chat' : 
                             conversation.type === 'interview' ? 'Interview' : 
                             `User ${otherParticipantId?.slice(-4)}`}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {formatDistanceToNow(new Date(conversation.updatedAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${typeConfig.bg} ${typeConfig.color}`}>
                    {typeConfig.label}
                </span>
            </div>
        </div>
    </Link>
  );
};
'use client';

import { useQuery } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Briefcase, User, ArrowLeft, Sparkles } from 'lucide-react';
import { Id } from '@convex/_generated/dataModel';

export default function ConversationsPage() {
  const { user } = useUser();
  const conversations = useQuery(api.conversations.list);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="flex items-center gap-3 mb-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
          <div className="bg-indigo-500/20 p-2.5 rounded-xl">
            <Sparkles className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
            <p className="text-slate-400 text-sm">Your professional network</p>
          </div>
          <div className="ml-auto">
             <Link
                href="/dashboard"
                className="p-2 hover:bg-slate-800 rounded-full transition-colors inline-flex"
            >
                <ArrowLeft className="w-6 h-6 text-slate-400" />
            </Link>
          </div>
        </header>

        <main className="bg-slate-900/30 border border-slate-800 rounded-2xl overflow-hidden p-1">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-6 min-h-[400px] space-y-4">
                {conversations === undefined ? (
                    <div className="text-center py-10 text-slate-500">Loading conversations...</div>
                ) : conversations.length === 0 ? (
                    <div className="text-center py-10">
                        <MessageSquare className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white">No conversations yet</h3>
                        <p className="text-slate-500">Start a project or contact a founder to begin.</p>
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <ConversationCard 
                            key={conversation._id} 
                            conversation={conversation} 
                            currentUserId={user.id as Id<'users'>} // Note: Clerk ID vs Convex ID might be tricky here if we need strict typing, but for display logic it's mostly about 'other' participant
                        />
                    ))
                )}
            </div>
        </main>
      </div>
    </div>
  );
}

function ConversationCard({ conversation, currentUserId }: { conversation: any, currentUserId: string }) {
    // We need to find the other participant. 
    // Since we don't have the full user object here easily without more queries or data, 
    // we'll rely on the type logic or just show generic info for now if names aren't populated.
    // The legacy code assumed we had IDs.
    
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
      }[conversation.type as 'direct' | 'workspace_general' | 'interview'] || {
          label: 'Chat',
          icon: MessageSquare,
          color: 'text-slate-400',
          bg: 'bg-slate-900/20',
      };
    
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
                                 'Direct Message'}
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
}

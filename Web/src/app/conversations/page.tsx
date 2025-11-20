'use client';

import { ConversationList } from '@/features/conversations/components/ConversationList';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useGetConversations } from '@/features/conversations/hooks/useGetConversations';
import type { Id } from '@/lib/convex';
import { ArrowLeft, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConversationsPage() {
  const { user } = useUser();
  const router = useRouter();
  const { conversations, isLoading, error } = useGetConversations();
  const currentUserId = user?.id as Id<'users'>;

  if (!FEATURE_FLAGS.CONVERSATION_EVOLUTION) {
    return (
      <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center items-center">
        <div className="w-full max-w-md glass p-8 rounded-2xl border border-white/10 text-center">
          <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">Feature Locked</h1>
          <p className="text-muted-foreground">
            Conversations are currently disabled. Check back later!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="flex items-center gap-3 mb-8 glass p-6 rounded-2xl border border-white/10">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Conversations</h1>
            <p className="text-muted-foreground text-sm">Your echoes in the void</p>
          </div>
          <div className="ml-auto">
             <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-white/10"
            >
                <ArrowLeft className="w-6 h-6" />
            </Button>
          </div>
        </header>

        <main className="glass rounded-2xl border border-white/10 overflow-hidden p-1">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 min-h-[400px]">
                <ConversationList
                    conversations={conversations}
                    isLoading={isLoading}
                    error={error}
                    currentUserId={currentUserId}
                />
            </div>
        </main>
      </div>
    </div>
  );
}
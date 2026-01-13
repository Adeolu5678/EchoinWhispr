'use client';

import { Suspense, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@clerk/nextjs';
import { useInboxData } from '@/features/inbox/hooks/useInboxData';
import { UnreadCountBadge } from './components/UnreadCountBadge';
import { RefreshButton } from './components/RefreshButton';
import { InboxContent } from './components/InboxContent';
import { ConversationList } from '@/features/conversations/components/ConversationList';
import type { Id } from '@/lib/convex';
import { Inbox, MessageSquare, Sparkles, Send } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';

export const dynamic = 'force-dynamic';

function InboxPageSkeleton() {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl animate-pulse">
        <div className="h-32 bg-primary/10 rounded-2xl mb-8 border border-white/5"></div>
        <div className="h-96 bg-card/50 rounded-2xl border border-white/5"></div>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [replyWhisperId, setReplyWhisperId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const echoWhisper = useMutation(api.conversations.echoWhisper);

  const {
    whispers,
    isLoadingWhispers,
    whispersError,
    conversations,
    isLoadingConversations,
    conversationsError,
    isLoading,
    totalUnreadCount,
    refetchAll,
    markAsRead,
  } = useInboxData();

  const currentUserId = user?.id as Id<'users'>;

  const handleReply = (whisperId: string) => {
    setReplyWhisperId(whisperId);
    setReplyContent('');
  };

  const handleSendReply = async () => {
    if (!replyWhisperId || !replyContent.trim()) return;

    setIsSendingReply(true);
    try {
      await echoWhisper({
        whisperId: replyWhisperId as Id<'whispers'>,
        replyContent: replyContent.trim(),
      });
      
      toast({
        title: "Echo sent!",
        description: "Your conversation has started.",
      });
      
      setReplyWhisperId(null);
      setReplyContent('');
      refetchAll();
    } catch (error) {
      console.error("Failed to send echo:", error);
      toast({
        title: "Failed to send echo",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSendingReply(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 md:mb-8 glass p-4 sm:p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 sm:p-2.5 rounded-xl">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Your Inbox</h1>
              <p className="text-muted-foreground text-xs sm:text-sm hidden sm:block">Manage your whispers and conversations</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <UnreadCountBadge unreadCount={totalUnreadCount} />
            <RefreshButton
              refetchWhispers={refetchAll}
              isLoadingWhispers={isLoading}
            />
          </div>
        </header>

        <div className="glass rounded-2xl border border-white/10 overflow-hidden p-1">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6">
            <Tabs defaultValue="whispers" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary/50 p-1 rounded-xl h-auto">
                <TabsTrigger 
                  value="whispers" 
                  className="rounded-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Whispers</span>
                  <span className="sm:hidden">Inbox</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="conversations" 
                  className="rounded-lg py-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Conversations</span>
                  <span className="sm:hidden">Chats</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="whispers" className="mt-0 focus-visible:outline-none">
                <Suspense fallback={<InboxPageSkeleton />}>
                  <InboxContent
                    whispers={whispers}
                    isLoadingWhispers={isLoadingWhispers}
                    whispersError={whispersError}
                    refetchWhispers={refetchAll}
                    markAsRead={markAsRead}
                    onReply={handleReply}
                  />
                </Suspense>
              </TabsContent>

              <TabsContent value="conversations" className="mt-0 focus-visible:outline-none">
                <Suspense fallback={<InboxPageSkeleton />}>
                  <ConversationList
                    conversations={conversations}
                    isLoading={isLoadingConversations}
                    error={conversationsError}
                    currentUserId={currentUserId}
                    onRefresh={refetchAll}
                  />
                </Suspense>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={!!replyWhisperId} onOpenChange={(open) => !open && setReplyWhisperId(null)}>
        <DialogContent className="w-[calc(100vw-32px)] max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle>Echo Back</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Start a conversation by replying to this whisper. Your identity will be revealed.
            </p>
            <Textarea
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyWhisperId(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendReply} 
              disabled={!replyContent.trim() || isSendingReply}
              className="gap-2"
            >
              {isSendingReply ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Send className="w-4 h-4" />
              )}
              Send Echo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  Copy, 
  Settings,
  Radio,
  Trash2,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import type { Id } from '@/lib/convex';

export default function ChamberViewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const chamber = useQuery(api.echoChambers.getChamber, { 
    chamberId: id as Id<'echoChambers'> 
  });
  const messagesData = useQuery(api.echoChambers.getMessages, { 
    chamberId: id as Id<'echoChambers'>,
    limit: 50
  });
  const typingUsers = useQuery(api.echoChambers.getTypingIndicators, {
    chamberId: id as Id<'echoChambers'>
  });

  const sendMessage = useMutation(api.echoChambers.sendMessage);
  const setTyping = useMutation(api.echoChambers.setTyping);
  const leaveChamber = useMutation(api.echoChambers.leaveChamber);
  const deleteChamber = useMutation(api.echoChambers.deleteChamber);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesData?.messages]);

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Typing indicator with debounce
  const handleTyping = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setTyping({ chamberId: id as Id<'echoChambers'> });
    }, 300);
  }, [id, setTyping]);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await sendMessage({
        chamberId: id as Id<'echoChambers'>,
        content: message.trim(),
      });
      setMessage('');
    } catch (error) {
      console.error('Send error:', error);
      toast({
        title: "Failed to send",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleLeave = async () => {
    try {
      await leaveChamber({ chamberId: id as Id<'echoChambers'> });
      toast({
        title: "Left chamber",
        description: "You've left this echo chamber.",
      });
      router.push('/chambers');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Cannot leave",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteChamber({ chamberId: id as Id<'echoChambers'> });
      toast({
        title: "Chamber deleted",
        description: "The chamber has been permanently deleted.",
      });
      router.push('/chambers');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: "Cannot delete",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/chambers/join/${chamber?.inviteCode}`);
    toast({
      title: "Link copied!",
      description: "Share it with others to join.",
    });
  };

  if (!chamber) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading chamber...</div>
      </div>
    );
  }

  if (!chamber.isMember) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <Card className="glass border-white/10 p-8 text-center max-w-md">
          <Radio className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You need an invite link to join this chamber.
          </p>
          <Link href="/chambers">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chambers
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Header */}
      <header className="sticky top-16 z-40 glass border-b border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/chambers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">{chamber.name}</h1>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="w-3 h-3" />
                {chamber.memberCount} members
                <span className="mx-1">•</span>
                <Badge 
                  variant="secondary" 
                  className="text-xs bg-purple-500/20 text-purple-300"
                >
                  {chamber.userAlias}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={copyInviteLink}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messagesData?.messages?.map((msg) => (
            <MessageBubble 
              key={msg._id} 
              message={msg}
              isOwn={msg.isOwnMessage}
            />
          ))}
          
          {typingUsers && typingUsers.length > 0 && (
            <div className="text-sm text-muted-foreground italic animate-pulse">
              {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 glass border-t border-white/10 px-4 py-3">
        <div className="max-w-4xl mx-auto flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="flex-1"
          />
          <Button 
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="bg-gradient-to-r from-emerald-600 to-cyan-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chamber Settings</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Invite Code</p>
              <code className="text-lg font-mono tracking-wider">
                {chamber.inviteCode}
              </code>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Your Identity</p>
              <Badge className="bg-purple-500/20 text-purple-300">
                {chamber.userAlias}
              </Badge>
              <span 
                className="ml-2 w-3 h-3 rounded-full inline-block" 
                style={{ backgroundColor: chamber.userColor }}
              />
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            {chamber.userRole === 'creator' ? (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                className="w-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Chamber
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleLeave}
                className="w-full"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Leave Chamber
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Message Bubble Component
function MessageBubble({ message, isOwn }: { message: {
  _id: Id<'echoChamberMessages'>;
  isOwnMessage: boolean;
  aliasColor?: string;
  anonymousAlias?: string;
  content: string;
  createdAt: number;
}; isOwn: boolean }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isOwn 
            ? 'bg-gradient-to-r from-emerald-600/40 to-cyan-600/40 rounded-br-md' 
            : 'bg-white/10 rounded-bl-md'
        }`}
      >
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: message.aliasColor }}
            />
            <span className="text-xs font-medium" style={{ color: message.aliasColor }}>
              {message.anonymousAlias}
            </span>
          </div>
        )}
        <p className="text-sm">{message.content}</p>
        <div className="text-xs text-muted-foreground mt-1 text-right">
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      </div>
    </div>
  );
}

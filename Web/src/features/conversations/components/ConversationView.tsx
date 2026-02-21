'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Paperclip, X, ChevronDown, Loader2 } from 'lucide-react';
import { Id, Doc } from '@/lib/convex';
import { useSendMessage } from '../hooks/useSendMessage';
import { useGetMessages } from '../hooks/useGetMessages';
import { formatDistanceToNow } from 'date-fns';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { FileUpload } from '@/components/ui/file-upload';
import Image from 'next/image';

const SCROLL_THRESHOLD = 100;

export const ConversationView: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [attachedImageUrl, setAttachedImageUrl] = useState<string | undefined>(undefined);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [cursor, setCursor] = useState<number | null | undefined>(undefined);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allMessages, setAllMessages] = useState<Doc<'messages'>[]>([]);
  const [oldestCursor, setOldestCursor] = useState<number | null>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [prevMessagesLength, setPrevMessagesLength] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef<number>(0);
  const loadingCursorRef = useRef<number | null | undefined>(undefined);
  const isMountedRef = useRef(true);
  
  const { sendMessage, isLoading: isSending } = useSendMessage();
  const { messages, nextCursor, hasMore, isLoading: isLoadingMessages } = useGetMessages(conversationId, cursor);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (messages && !isLoadingMessages) {
      if (cursor === undefined) {
        setAllMessages(messages);
        setOldestCursor(nextCursor);
        setHasMoreMessages(hasMore);
        loadingCursorRef.current = undefined;
      } else if (isLoadingMore) {
        const expectedCursor = loadingCursorRef.current;
        if (cursor !== expectedCursor) {
          return;
        }
        const container = messagesContainerRef.current;
        if (container) {
          scrollPositionRef.current = container.scrollHeight;
        }
        const olderMessages = messages;
        setAllMessages(prev => [...olderMessages, ...prev]);
        setOldestCursor(nextCursor);
        setHasMoreMessages(hasMore);
        setIsLoadingMore(false);
        loadingCursorRef.current = undefined;
      }
    }
  }, [messages, nextCursor, hasMore, isLoadingMessages, cursor, isLoadingMore]);

  useEffect(() => {
    if (allMessages.length > prevMessagesLength) {
      const newMessagesCount = allMessages.length - prevMessagesLength;
      if (cursor === undefined || newMessagesCount === 1) {
        if (isNearBottom || cursor === undefined) {
          scrollToBottom();
        }
      }
      setPrevMessagesLength(allMessages.length);
    }
  }, [allMessages.length, prevMessagesLength, isNearBottom, cursor, scrollToBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      const nearBottom = distanceFromBottom <= SCROLL_THRESHOLD;
      
      setIsNearBottom(nearBottom);
      setShowScrollButton(!nearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isLoadingMore) {
      const container = messagesContainerRef.current;
      if (container) {
        const prevScrollHeight = scrollPositionRef.current;
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
        });
      }
    }
  }, [allMessages, isLoadingMore]);

  const handleLoadMore = useCallback(() => {
    if (hasMoreMessages && oldestCursor && !isLoadingMore) {
      setIsLoadingMore(true);
      loadingCursorRef.current = oldestCursor;
      setCursor(oldestCursor);
    }
  }, [hasMoreMessages, oldestCursor, isLoadingMore]);

  const handleSendMessage = async () => {
    if (!message.trim() && !attachedImageUrl) return;

    try {
      await sendMessage(conversationId as Id<'conversations'>, message.trim(), attachedImageUrl);
      if (isMountedRef.current) {
        setMessage('');
        setAttachedImageUrl(undefined);
        setPreviewImageUrl(undefined);
      }
    } catch (error) {
      // Silently ignore send errors - UI remains responsive
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoadingMessages && cursor === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading conversation...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)] md:h-[calc(100dvh-140px)]">
      <Card className="mb-4 flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Conversation
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Both participants&apos; identities are now revealed
          </p>
        </CardHeader>
      </Card>

      <Card className="flex-1 mb-4 overflow-hidden relative">
        <CardContent ref={messagesContainerRef} className="p-4 h-full overflow-y-auto scrollbar-hide">
          {hasMoreMessages && (
            <div className="flex justify-center pb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="text-xs"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load older messages'
                )}
              </Button>
            </div>
          )}
          
          {allMessages && allMessages.length > 0 ? (
             <div className="space-y-4">
               {allMessages.map((msg: Doc<'messages'>) => (
                 <div
                   key={msg._id}
                   className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                 >
                   <div
                     className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                       msg.senderId === user?.id
                         ? 'bg-primary text-primary-foreground'
                         : 'bg-muted'
                     }`}
                   >
                     {FEATURE_FLAGS.CONVERSATION_EVOLUTION && msg.imageUrl && (
                       <div className="mb-2 overflow-hidden">
                         <Image
                           src={msg.imageUrl}
                           alt="Attached image"
                           width={200}
                           height={200}
                           loading="lazy"
                           className="rounded-md object-cover max-w-full h-auto"
                           style={{ maxWidth: '200px', maxHeight: '200px' }}
                         />
                       </div>
                     )}
                     <p className="text-sm">{msg.content}</p>
                     <p className="text-xs opacity-70 mt-1">
                       {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                     </p>
                   </div>
                 </div>
               ))}
               <div ref={messagesEndRef} />
             </div>
           ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </CardContent>
        
        {showScrollButton && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 rounded-full shadow-lg h-10 w-10"
            onClick={scrollToBottom}
            aria-label="Scroll to bottom"
          >
            <ChevronDown className="h-5 w-5" />
          </Button>
        )}
      </Card>

      <div className="flex-shrink-0 sticky bottom-0 bg-background/95 backdrop-blur-sm pt-2 pb-2 md:pb-0 safe-bottom">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 touch-target"
            disabled={isSending}
          />
          {FEATURE_FLAGS.CONVERSATION_EVOLUTION && (
            <Button
              onClick={() => setShowImageUpload(!showImageUpload)}
              variant="outline"
              size="icon"
              disabled={isSending}
              className="touch-target"
              aria-label={showImageUpload ? 'Close image upload' : 'Attach image'}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={handleSendMessage}
            disabled={(!message.trim() && !attachedImageUrl) || isSending}
            size="icon"
            className="touch-target"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {FEATURE_FLAGS.CONVERSATION_EVOLUTION && showImageUpload && (
          <FileUpload
            onFileUploaded={(storageId, url) => {
              setAttachedImageUrl(url);
              setPreviewImageUrl(url);
              setShowImageUpload(false);
            }}
            onUploadError={(error) => {
              console.error('Image upload error:', error);
              setShowImageUpload(false);
            }}
            onUploadCancel={() => setShowImageUpload(false)}
            className="mt-2"
          />
        )}
        {FEATURE_FLAGS.CONVERSATION_EVOLUTION && previewImageUrl && (
          <div className="mt-2 relative inline-block">
            <Image
              src={previewImageUrl}
              alt="Preview"
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
            <Button
              onClick={() => {
                setAttachedImageUrl(undefined);
                setPreviewImageUrl(undefined);
              }}
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 p-0"
              aria-label="Remove attached image"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

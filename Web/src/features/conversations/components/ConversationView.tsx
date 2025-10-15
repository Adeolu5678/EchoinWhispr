'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, User, Paperclip, X } from 'lucide-react';
import { Id, Doc } from '@/lib/convex';
import { useSendMessage } from '../hooks/useSendMessage';
import { useGetMessages } from '../hooks/useGetMessages';
import { formatDistanceToNow } from 'date-fns';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { FileUpload } from '@/components/ui/file-upload';
import Image from 'next/image';

/**
 * ConversationView component displays the full conversation with message history and input.
 * Shows both participants' identities and allows sending messages.
 */
export const ConversationView: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [attachedImageUrl, setAttachedImageUrl] = useState<string | undefined>(undefined);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | undefined>(undefined);
  const { sendMessage, isLoading: isSending } = useSendMessage();
  const { messages, isLoading: isLoadingMessages } = useGetMessages(conversationId);

  const handleSendMessage = async () => {
    if (!message.trim() && !attachedImageUrl) return;

    try {
      await sendMessage(conversationId as Id<'conversations'>, message.trim(), attachedImageUrl);
      setMessage('');
      setAttachedImageUrl(undefined);
      setPreviewImageUrl(undefined);
    } catch (error) {
      // Error handled by hook
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading conversation...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[600px]">
      {/* Conversation Header */}
      <Card className="mb-4">
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

      {/* Messages Area */}
      <Card className="flex-1 mb-4">
        <CardContent className="p-4 h-96 overflow-y-auto">
          {messages && messages.length > 0 ? (
             <div className="space-y-4">
               {messages.map((msg: Doc<'messages'>) => (
                 <div
                   key={msg._id}
                   className={`flex ${msg.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                 >
                   <div
                     className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                       msg.senderId === user?.id
                         ? 'bg-primary text-primary-foreground'
                         : 'bg-muted'
                     }`}
                   >
                     {FEATURE_FLAGS.CONVERSATION_EVOLUTION && msg.imageUrl && (
                       <div className="mb-2">
                         <Image
                           src={msg.imageUrl}
                           alt="Attached image"
                           width={200}
                           height={200}
                           className="rounded-md object-cover max-w-full h-auto"
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
             </div>
           ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Message Input */}
      <div className="flex gap-2">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isSending}
        />
        {FEATURE_FLAGS.CONVERSATION_EVOLUTION && (
          <Button
            onClick={() => setShowImageUpload(!showImageUpload)}
            variant="outline"
            size="icon"
            disabled={isSending}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        )}
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending}
          size="icon"
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
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};
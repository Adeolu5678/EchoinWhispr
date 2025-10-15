'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Clock, User, MapPin, Send, AlertCircle } from 'lucide-react';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { EchoButton } from '@/features/conversations/components/EchoButton';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/lib/convex';
import { useQuery, useMutation } from 'convex/react';
import { Id } from '@/lib/convex';

/**
 * WhisperDetailPage component displays full whisper content with interaction options
 * Includes Echo button for identity revelation and reply composer for conversations
 */
export default function WhisperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const whisperId = (params.id as string) as Id<'whispers'>;

  // Fetch whisper data
  const whisper = useQuery(api.whispers.getWhisperById, { whisperId });

  // Reply functionality
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const echoWhisper = useMutation(api.conversations.echoWhisper);

  /**
   * Handles sending a reply that creates a conversation
   */
  const handleReply = async () => {
    if (!replyContent.trim() || !whisper) return;

    setIsReplying(true);
    try {
      await echoWhisper({
        whisperId: whisper._id as Id<'whispers'>,
         replyContent: replyContent.trim(),
      });

      toast({
        title: 'Echo request sent!',
        description: 'Your conversation has been started.',
      });

      // Navigate to conversations page
      router.push('/conversations');
    } catch (error) {
      console.error('Failed to echo whisper:', error);
      toast({
        title: 'Failed to send reply',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReplying(false);
    }
  };

  /**
   * Formats the timestamp for display
   */
  const formattedTime = whisper
    ? formatDistanceToNow(new Date(whisper._creationTime), { addSuffix: true })
    : '';

  // Loading state
  if (!whisper) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

// If whisper data loads successfully, user is authorized as recipient
// The Convex backend already enforces that only recipients can access whispers
const isRecipient: boolean = !!whisper;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Whisper Details</h1>
        </div>

        {/* Whisper Content Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" aria-hidden="true" />
                <span>
                  {FEATURE_FLAGS.CONVERSATION_EVOLUTION && whisper.conversationId
                    ? 'Anonymous' // TODO: Implement sender name resolution when schema supports it
                    : 'Anonymous'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <time dateTime={new Date(whisper._creationTime).toISOString()}>
                  {formattedTime}
                </time>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Whisper content */}
            <div className="text-base leading-relaxed">
              {whisper.content}
            </div>

            {/* Image display */}
            {FEATURE_FLAGS.IMAGE_UPLOADS && whisper.imageUrl && (
              <div className="mt-4">
                <Image
                  src={whisper.imageUrl}
                  alt="Whisper image"
                  width={400}
                  height={300}
                  className="w-full max-w-md h-auto rounded-lg object-cover"
                  onError={(e) => {
                    console.error('Failed to load image:', whisper.imageUrl);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Location display */}
            {FEATURE_FLAGS.LOCATION_BASED_FEATURES && whisper.location && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>
                  Location: {whisper.location.latitude.toFixed(4)}, {whisper.location.longitude.toFixed(4)}
                </span>
              </div>
            )}

            {/* Action buttons - only for recipient */}
            {isRecipient && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                {/* Echo button - feature flagged */}
                {FEATURE_FLAGS.CONVERSATION_EVOLUTION && (
                  <EchoButton
                    whisperId={whisper._id as Id<'whispers'>}
                    recipientId={user!.id}
                    onSuccess={() => {
                      toast({
                        title: 'Echo request sent!',
                        description: 'The sender will be notified of your interest.',
                      });
                    }}
                  />
                )}

                {/* Reply button - always available */}
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('reply-textarea')?.focus()}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Reply
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reply composer - only for recipient */}
        {isRecipient && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send Reply</CardTitle>
              <p className="text-sm text-muted-foreground">
                Start a conversation by replying to this whisper
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                id="reply-textarea"
                placeholder="Type your reply here..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={280}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {replyContent.length}/280 characters
                </span>
                <Button
                  onClick={handleReply}
                  disabled={!replyContent.trim() || isReplying}
                  className="flex items-center gap-2"
                >
                  {isReplying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Reply
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info for non-recipients */}
        {!isRecipient && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You can only reply to whispers that were sent to you. Please check if you are logged in with the correct account.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
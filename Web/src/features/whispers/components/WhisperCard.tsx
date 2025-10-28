'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WhisperWithSender } from '../types';
import { useMarkAsRead } from '../hooks/useWhispers';
import { useTokenManager } from '@/features/profile/hooks/useTokenManager';
import { formatDistanceToNow } from 'date-fns';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { CheckCircle2, Clock, User, MapPin, Coins } from 'lucide-react';
import { ConsensusTimestamp } from './ConsensusTimestamp';
import { AIHeadingGenerator } from './AIHeadingGenerator';
import { useToast } from '@/hooks/use-toast';
import { Id } from '@/lib/convex';

interface WhisperCardProps {
  whisper: WhisperWithSender;
  showMarkAsRead?: boolean;
  onMarkAsRead?: (whisperId: string) => void;
  className?: string;
}

/**
 * WhisperCard component for displaying individual whispers
 * Shows whisper content, metadata, and provides mark as read functionality
 *
 * @param whisper - The whisper data to display
 * @param showMarkAsRead - Whether to show the mark as read button
 * @param onMarkAsRead - Optional callback when whisper is marked as read
 * @param className - Additional CSS classes
 */
export const WhisperCard: React.FC<WhisperCardProps> = React.memo(
  ({ whisper, showMarkAsRead = true, onMarkAsRead, className = '' }) => {
    const { markAsRead, isLoading } = useMarkAsRead();
    const { transferTokens } = useTokenManager();
    const { toast } = useToast();
    const [tipAmount, setTipAmount] = useState<string>('');
    const [isTipping, setIsTipping] = useState(false);

    /**
     * Handles marking the whisper as read
     * Calls the hook and optional callback
     */
    const handleMarkAsRead = useCallback(async () => {
      try {
        await markAsRead(whisper._id);
        onMarkAsRead?.(whisper._id);
      } catch (error) {
        // Error handling is managed by the hook with toast notifications
        console.error('Failed to mark whisper as read:', error);
      }
    }, [whisper._id, markAsRead, onMarkAsRead]);

    /**
     * Handles tipping tokens to the whisper sender
     */
    const handleTip = useCallback(async () => {
      const amount = parseFloat(tipAmount);
      if (!amount || amount <= 0) {
        toast({
          title: 'Invalid amount',
          description: 'Please enter a valid tip amount',
          variant: 'destructive',
        });
        return;
      }

      setIsTipping(true);
      try {
        await transferTokens(whisper.senderId, amount, whisper._id);
        toast({
          title: 'Tip sent!',
          description: `Successfully tipped ${amount} tokens`,
        });
        setTipAmount('');
      } catch (error) {
        toast({
          title: 'Tip failed',
          description: 'Failed to send tip. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsTipping(false);
      }
    }, [tipAmount, transferTokens, whisper.senderId, whisper._id, toast]);

    /**
     * Formats the timestamp for display
     */
    const formattedTime = useMemo(() => {
      try {
        return formatDistanceToNow(new Date(whisper._creationTime), {
          addSuffix: true,
        });
      } catch {
        return whisper.relativeTime || 'Unknown time';
      }
    }, [whisper._creationTime, whisper.relativeTime]);

    /**
     * Determines the card styling based on read status
     */
    const cardClassName = useMemo(() => {
      const baseClasses = 'transition-all duration-200 hover:shadow-md';
      const statusClasses = whisper.isRead
        ? 'bg-muted/30 border-muted'
        : 'bg-background border-border shadow-sm';

      return `${baseClasses} ${statusClasses} ${className}`.trim();
    }, [whisper.isRead, className]);

    /**
     * Determines the content styling based on read status
     */
    const contentClassName = useMemo(() => {
      return whisper.isRead
        ? 'text-muted-foreground'
        : 'text-foreground font-medium';
    }, [whisper.isRead]);

    return (
      <Link href={`/whispers/${whisper._id}`} className="block">
        <Card
          className={cardClassName}
          role="article"
          aria-label="Whisper message"
        >
          <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header with sender info and timestamp */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" aria-hidden="true" />
                <span>
                  {FEATURE_FLAGS.CONVERSATION_EVOLUTION &&
                  whisper.conversationId
                    ? whisper.senderName || 'Anonymous'
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

            {/* AI Heading display */}
            {FEATURE_FLAGS.AI_GENERATED_WHISPER_HEADINGS && whisper.heading && (
              <div className="mb-2">
                <AIHeadingGenerator
                  whisperId={whisper._id as Id<'whispers'>}
                  whisperContent={whisper.content}
                  currentHeading={whisper.heading}
                  className="mb-2"
                />
              </div>
            )}

            {/* Whisper content */}
            <div className={`text-sm leading-relaxed ${contentClassName}`}>
              {whisper.content}
            </div>
            {/* Image display */}
            {FEATURE_FLAGS.IMAGE_UPLOADS && whisper.imageUrl && (
              <div className="mt-3">
                <Image
                  src={whisper.imageUrl}
                  alt="Whisper image"
                  width={400}
                  height={300}
                  className="w-full max-w-sm h-auto rounded-lg object-cover"
                  priority={false}
                  onError={(e) => {
                    console.error('Failed to load image:', whisper.imageUrl);
                    // Hide the image on error
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}

            {/* Location display */}
            {FEATURE_FLAGS.LOCATION_BASED_FEATURES && whisper.location && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>
                  Location: {whisper.location.latitude.toFixed(4)}, {whisper.location.longitude.toFixed(4)}
                </span>
              </div>
            )}

            {/* Consensus Timestamp display */}
            {FEATURE_FLAGS.IMMUTABLE_WHISPER_TIMESTAMPING_VIA_CONSENSUS_SERVICE && (
              <div className="mt-3">
                <ConsensusTimestamp
                  whisperId={whisper._id}
                  consensusTimestamp={whisper.consensusTimestamp}
                  consensusHash={whisper.consensusHash}
                />
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-between items-center pt-2 border-t border-border/50">
              {/* Tipping functionality - conditionally shown */}
              {FEATURE_FLAGS.TOKENIZED_WHISPER_REWARDS_AND_TIPPING && (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={tipAmount}
                    onChange={(e) => setTipAmount(e.target.value)}
                    className="w-20 h-8 text-xs"
                    min="0"
                    step="0.01"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleTip}
                    disabled={isTipping || !tipAmount}
                    className="h-8 px-3 text-xs"
                    aria-label="Tip tokens"
                  >
                    {isTipping ? (
                      'Tipping...'
                    ) : (
                      <>
                        <Coins className="w-3 h-3 mr-1" aria-hidden="true" />
                        Tip
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Mark as read button */}
              {showMarkAsRead && !whisper.isRead && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAsRead}
                  disabled={isLoading}
                  className="h-8 px-3 text-xs"
                  aria-label={`Mark whisper as read`}
                >
                  {isLoading ? (
                    'Marking...'
                  ) : (
                    <>
                      <CheckCircle2
                        className="w-3 h-3 mr-1"
                        aria-hidden="true"
                      />
                      Mark as Read
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Read indicator */}
            {whisper.isRead && (
              <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
                <CheckCircle2 className="w-3 h-3" aria-hidden="true" />
                <span>Read</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      </Link>
    );
  }
);

WhisperCard.displayName = 'WhisperCard';

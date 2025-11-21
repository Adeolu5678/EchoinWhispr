'use client';

import React, { useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WhisperWithSender } from '../types';
import { useMarkAsRead } from '../hooks/useWhispers';
import { formatDistanceToNow } from 'date-fns';
import { useFeatureFlag } from '@/hooks/useFeatureFlags';
import { CheckCircle2, Clock, User, MapPin, MessageCircle, Link as LinkIcon } from 'lucide-react';

interface WhisperCardProps {
  whisper: WhisperWithSender;
  showMarkAsRead?: boolean;
  onMarkAsRead?: (whisperId: string) => void;
  onReply?: (whisperId: string) => void;
  onChain?: (whisperId: string) => void;
  className?: string;
}

/**
 * WhisperCard component for displaying individual whispers
 * Shows whisper content, metadata, and provides mark as read functionality
 *
 * @param whisper - The whisper data to display
 * @param showMarkAsRead - Whether to show the mark as read button
 * @param onMarkAsRead - Optional callback when whisper is marked as read
 * @param onReply - Optional callback when user wants to reply (Echo Back)
 * @param onChain - Optional callback when user wants to add to chain
 * @param className - Additional CSS classes
 */
export const WhisperCard: React.FC<WhisperCardProps> = React.memo(
  ({ whisper, showMarkAsRead = true, onMarkAsRead, onReply, onChain, className = '' }) => {
    const { markAsRead, isLoading } = useMarkAsRead();
    const isConversationEvolutionEnabled = useFeatureFlag('CONVERSATION_EVOLUTION');
    const isWhisperChainsEnabled = useFeatureFlag('WHISPER_CHAINS');
    const isImageUploadsEnabled = useFeatureFlag('IMAGE_UPLOADS');
    const isLocationEnabled = useFeatureFlag('LOCATION_BASED_FEATURES');

    /**
     * Handles marking the whisper as read
     * Calls the hook and optional callback
     */
    const handleMarkAsRead = useCallback(async (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent link navigation
      try {
        await markAsRead(whisper._id);
        onMarkAsRead?.(whisper._id);
      } catch (error) {
        // Error handling is managed by the hook with toast notifications
        console.error('Failed to mark whisper as read:', error);
      }
    }, [whisper._id, markAsRead, onMarkAsRead]);

    const handleReply = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      onReply?.(whisper._id);
    }, [whisper._id, onReply]);

    const handleChain = useCallback((e: React.MouseEvent) => {
      e.preventDefault();
      onChain?.(whisper._id);
    }, [whisper._id, onChain]);

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
                  {isConversationEvolutionEnabled &&
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

            {/* Whisper content */}
            <div className={`text-sm leading-relaxed ${contentClassName}`}>
              {whisper.content}
            </div>
            {/* Image display */}
            {isImageUploadsEnabled && whisper.imageUrl && (
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
            {isLocationEnabled && whisper.location && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>
                  Location: {whisper.location.latitude.toFixed(4)}, {whisper.location.longitude.toFixed(4)}
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end pt-2 border-t border-border/50 gap-2">
              {/* Reply / Echo Back */}
              {isConversationEvolutionEnabled && !whisper.isOwnWhisper && onReply && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReply}
                  className="h-8 px-3 text-xs gap-1"
                  aria-label="Reply to whisper"
                >
                  <MessageCircle className="w-3 h-3" />
                  Echo Back
                </Button>
              )}

              {/* Add to Chain */}
              {isWhisperChainsEnabled && whisper.isOwnWhisper && onChain && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChain}
                  className="h-8 px-3 text-xs gap-1"
                  aria-label="Add to chain"
                >
                  <LinkIcon className="w-3 h-3" />
                  Chain
                </Button>
              )}

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

'use client';

import React, { useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WhisperCard } from './WhisperCard';
import { EmptyWhisperState } from './EmptyWhisperState';
import { useReceivedWhispers } from '../hooks/useWhispers';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WhisperListSkeleton } from '@/components/ui/skeletons';
import { RefreshCw, AlertCircle, ChevronDown, Loader2 } from 'lucide-react';
import { WhisperWithSender } from '../types';

interface WhisperListProps {
  className?: string;
  whispers?: WhisperWithSender[];
  isLoading?: boolean;
  error?: Error | null;
  showMarkAsRead?: boolean;
  onWhisperMarkAsRead?: (whisperId: string) => void;
  onReply?: (whisperId: string) => void;
  onChain?: (whisperId: string) => void;
  emptyStateMessage?: string;
  emptyStateActionLabel?: string;
  onEmptyStateAction?: () => void;
}

/**
 * WhisperList component for displaying a collection of whispers
 * Features virtualization for performance, loading states, error handling,
 * and empty state management
 *
 * @param className - Additional CSS classes
 * @param whispers - Optional array of whispers to display. If not provided, fetches from useReceivedWhispers
 * @param isLoading - Optional loading state override
 * @param error - Optional error state override
 * @param showMarkAsRead - Whether to show mark as read buttons on cards
 * @param onWhisperMarkAsRead - Callback when a whisper is marked as read
 * @param onReply - Callback when user wants to reply
 * @param onChain - Callback when user wants to add to chain
 * @param emptyStateMessage - Custom message for empty state
 * @param emptyStateActionLabel - Custom label for empty state action button
 * @param onEmptyStateAction - Callback for empty state action
 */
export const WhisperList: React.FC<WhisperListProps> = React.memo(
  ({
    className = '',
    whispers: propWhispers,
    isLoading: propIsLoading,
    error: propError,
    showMarkAsRead = true,
    onWhisperMarkAsRead,
    onReply,
    onChain,
    emptyStateMessage,
    emptyStateActionLabel,
    onEmptyStateAction,
  }) => {
    // If props are provided, use them. Otherwise, use the hook.
    const hookData = useReceivedWhispers();
    
    const whispers = propWhispers ?? hookData.whispers;
    const isLoading = propIsLoading ?? hookData.isLoading;
    const error = propError ?? hookData.error;
    const refetch = hookData.refetch;
    const hasMore = hookData.hasMore;
    const loadMore = hookData.loadMore;
    const isLoadingMore = hookData.isLoadingMore;

    /**
     * Handles manual refresh of the whisper list
     */
    const handleRefresh = useCallback(async () => {
      refetch();
      onEmptyStateAction?.();
    }, [refetch, onEmptyStateAction]);

    /**
     * Handles when a whisper is marked as read
     */
    const handleWhisperMarkAsRead = useCallback(
      (whisperId: string) => {
        onWhisperMarkAsRead?.(whisperId);
      },
      [onWhisperMarkAsRead]
    );

    /**
     * Memoized loading skeleton component using shared skeletons
     */
    const LoadingSkeleton = useMemo(
      () => (
        <div role="status" aria-label="Loading whispers">
          <WhisperListSkeleton count={3} />
        </div>
      ),
      []
    );

    /**
     * Memoized error state component
     */
    const ErrorState = useMemo(
      () => (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <AlertCircle
              className="w-12 h-12 text-destructive mx-auto mb-4"
              aria-hidden="true"
            />
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Failed to load whispers
            </h3>
            <p className="text-muted-foreground mb-4">
              {error?.message ||
                'An unexpected error occurred while loading your whispers.'}
            </p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="gap-2"
              aria-label="Retry loading whispers"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ),
      [error, handleRefresh]
    );

    /**
     * Memoized empty state component
     */
    const EmptyState = useMemo(
      () => (
        <EmptyWhisperState
          message={emptyStateMessage}
          actionLabel={emptyStateActionLabel}
          onAction={handleRefresh}
        />
      ),
      [emptyStateMessage, emptyStateActionLabel, handleRefresh]
    );

    // Loading state
    if (isLoading) {
      return (
        <div className={`space-y-4 ${className}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Whispers</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
              aria-label="Refresh whispers"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          {LoadingSkeleton}
        </div>
      );
    }

    // Error state
    if (error) {
      return (
        <div className={`space-y-4 ${className}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Whispers</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
              aria-label="Refresh whispers"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          {ErrorState}
        </div>
      );
    }

    // Empty state
    if (!whispers || whispers.length === 0) {
      return (
        <div className={`space-y-4 ${className}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Whispers</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="gap-2"
              aria-label="Refresh whispers"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
          {EmptyState}
        </div>
      );
    }

    // Success state with whispers
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Your Whispers
            <span className="text-sm font-normal text-muted-foreground ml-2">
              ({whispers.length})
            </span>
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
            aria-label="Refresh whispers"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div 
            className="space-y-4" 
            role="list" 
            aria-label="Whispers list"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
          >
            {whispers.map((whisper) => (
              <motion.div 
                key={whisper._id.toString()} 
                role="listitem"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: { 
                      duration: 0.4, 
                      ease: [0.25, 0.1, 0.25, 1] 
                    } 
                  },
                }}
                exit={{ opacity: 0, x: -20 }}
              >
                <WhisperCard
                  whisper={whisper}
                  showMarkAsRead={showMarkAsRead}
                  onMarkAsRead={handleWhisperMarkAsRead}
                  onReply={onReply}
                  onChain={onChain}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Load More Button */}
        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              onClick={loadMore}
              variant="outline"
              size="lg"
              disabled={isLoadingMore}
              className="gap-2 min-w-[200px]"
              aria-label={isLoadingMore ? 'Loading more whispers' : 'Load more whispers'}
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Load More Whispers
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

WhisperList.displayName = 'WhisperList';

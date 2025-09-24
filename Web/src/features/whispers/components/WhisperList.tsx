'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { WhisperCard } from './WhisperCard'
import { EmptyWhisperState } from './EmptyWhisperState'
import { WhisperWithSender } from '../types'
import { useReceivedWhispers } from '../hooks/useWhispers'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw, AlertCircle, Loader2 } from 'lucide-react'

interface WhisperListProps {
  className?: string
  showMarkAsRead?: boolean
  onWhisperMarkAsRead?: (whisperId: string) => void
  emptyStateMessage?: string
  emptyStateActionLabel?: string
  onEmptyStateAction?: () => void
}

/**
 * WhisperList component for displaying a collection of whispers
 * Features virtualization for performance, loading states, error handling,
 * and empty state management
 *
 * @param className - Additional CSS classes
 * @param showMarkAsRead - Whether to show mark as read buttons on cards
 * @param onWhisperMarkAsRead - Callback when a whisper is marked as read
 * @param emptyStateMessage - Custom message for empty state
 * @param emptyStateActionLabel - Custom label for empty state action button
 * @param onEmptyStateAction - Callback for empty state action
 */
export const WhisperList: React.FC<WhisperListProps> = React.memo(({
  className = '',
  showMarkAsRead = true,
  onWhisperMarkAsRead,
  emptyStateMessage,
  emptyStateActionLabel,
  onEmptyStateAction,
}) => {
  const [refreshKey, setRefreshKey] = useState(0)
  const { whispers, isLoading, error, refetch } = useReceivedWhispers()

  /**
   * Handles manual refresh of the whisper list
   */
  const handleRefresh = useCallback(async () => {
    setRefreshKey(prev => prev + 1)
  }, [])

  /**
   * Handles when a whisper is marked as read
   */
  const handleWhisperMarkAsRead = useCallback((whisperId: string) => {
    onWhisperMarkAsRead?.(whisperId)
  }, [onWhisperMarkAsRead])

  /**
   * Memoized loading skeleton component
   */
  const LoadingSkeleton = useMemo(() => (
    <div className="space-y-4" role="status" aria-label="Loading whispers">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="animate-pulse">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="h-4 bg-muted rounded w-24" />
                <div className="h-3 bg-muted rounded w-16" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  ), [])

  /**
   * Memoized error state component
   */
  const ErrorState = useMemo(() => (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-6 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-destructive mb-2">
          Failed to load whispers
        </h3>
        <p className="text-muted-foreground mb-4">
          {error?.message || 'An unexpected error occurred while loading your whispers.'}
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
  ), [error, handleRefresh])

  /**
   * Memoized empty state component
   */
  const EmptyState = useMemo(() => (
    <EmptyWhisperState
      message={emptyStateMessage}
      actionLabel={emptyStateActionLabel}
      onAction={onEmptyStateAction}
    />
  ), [emptyStateMessage, emptyStateActionLabel, onEmptyStateAction])

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
    )
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
    )
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
    )
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

      <div className="space-y-4" role="list" aria-label="Whispers list">
        {whispers.map((whisper) => (
          <div key={whisper._id} role="listitem">
            <WhisperCard
              whisper={whisper}
              showMarkAsRead={showMarkAsRead}
              onMarkAsRead={handleWhisperMarkAsRead}
            />
          </div>
        ))}
      </div>
    </div>
  )
})

WhisperList.displayName = 'WhisperList'
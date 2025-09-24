'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageSquare, Sparkles } from 'lucide-react'

interface EmptyWhisperStateProps {
  message?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

/**
 * EmptyWhisperState component for displaying engaging empty states
 * when users have no whispers to display
 *
 * @param message - Custom message to display
 * @param actionLabel - Label for the action button
 * @param onAction - Callback function for the action button
 * @param className - Additional CSS classes
 */
export const EmptyWhisperState: React.FC<EmptyWhisperStateProps> = React.memo(({
  message,
  actionLabel,
  onAction,
  className = '',
}) => {
  const defaultMessage = "You haven't received any whispers yet. When someone sends you a message, it will appear here."
  const defaultActionLabel = "Send Your First Whisper"

  return (
    <Card className={`border-dashed border-2 ${className}`} role="region" aria-label="No whispers">
      <CardContent className="p-8 text-center">
        <div className="space-y-4">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <MessageSquare className="w-16 h-16 text-muted-foreground/50" aria-hidden="true" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-6 h-6 text-primary" aria-hidden="true" />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              No whispers yet
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              {message || defaultMessage}
            </p>
          </div>

          {/* Action Button */}
          {onAction && (
            <div className="pt-4">
              <Button
                onClick={onAction}
                className="gap-2"
                aria-label={actionLabel || defaultActionLabel}
              >
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
                {actionLabel || defaultActionLabel}
              </Button>
            </div>
          )}

          {/* Additional encouragement */}
          <div className="pt-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              💭 Whispers are anonymous messages that can brighten someone's day
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

EmptyWhisperState.displayName = 'EmptyWhisperState'
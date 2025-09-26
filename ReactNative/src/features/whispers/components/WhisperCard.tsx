'use client'

import React, { useCallback, useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { WhisperWithSender } from '../types'
import { useMarkAsRead } from '../hooks/useWhispers'
import { formatDistanceToNow } from 'date-fns'
import { FEATURE_FLAGS } from '@/config/featureFlags'

interface WhisperCardProps {
  whisper: WhisperWithSender
  showMarkAsRead?: boolean
  onMarkAsRead?: (whisperId: string) => void
  className?: string
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
export const WhisperCard: React.FC<WhisperCardProps> = React.memo(({
  whisper,
  showMarkAsRead = true,
  onMarkAsRead,
  className = '',
}) => {
  const { markAsRead, isLoading } = useMarkAsRead()

  /**
   * Handles marking the whisper as read
   * Calls the hook and optional callback
   */
  const handleMarkAsRead = useCallback(async () => {
    try {
      await markAsRead(whisper._id)
      onMarkAsRead?.(whisper._id)
    } catch (error) {
      // Error handling is managed by the hook with toast notifications
      console.error('Failed to mark whisper as read:', error)
    }
  }, [whisper._id, markAsRead, onMarkAsRead])

  /**
   * Formats the timestamp for display
   */
  const formattedTime = useMemo(() => {
    try {
      return formatDistanceToNow(new Date(whisper._creationTime), { addSuffix: true })
    } catch {
      return whisper.relativeTime || 'Unknown time'
    }
  }, [whisper._creationTime, whisper.relativeTime])

  /**
   * Determines the card styling based on read status
   */
  const cardClassName = useMemo(() => {
    const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4'
    const statusClasses = whisper.isRead
      ? 'bg-gray-50 border-gray-300'
      : 'bg-white border-gray-200'

    return `${baseClasses} ${statusClasses} ${className}`.trim()
  }, [whisper.isRead, className])

  /**
   * Determines the content styling based on read status
   */
  const contentClassName = useMemo(() => {
    return whisper.isRead
      ? 'text-gray-600'
      : 'text-gray-900 font-medium'
  }, [whisper.isRead])

  return (
    <View className={cardClassName} accessibilityRole="text">
      <View className="space-y-3">
        {/* Header with sender info and timestamp */}
        <View className="flex-row justify-between items-start">
          <View className="flex-row items-center">
            <Text className="text-sm text-gray-500 mr-2">👤</Text>
            <Text className="text-sm text-gray-500">
              {FEATURE_FLAGS.CONVERSATION_EVOLUTION && whisper.conversationId
                ? whisper.senderName || 'Anonymous'
                : 'Anonymous'}
            </Text>
            {!whisper.isRead && (
              <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
            )}
          </View>

          <Text className="text-xs text-gray-400">
            {formattedTime}
          </Text>
        </View>

        {/* Whisper content */}
        <Text className={`text-sm leading-5 ${contentClassName}`}>
          {whisper.content}
        </Text>

        {/* Action buttons */}
        <View className="flex-row justify-between items-center pt-2 border-t border-gray-100">
          {showMarkAsRead && !whisper.isRead && (
            <TouchableOpacity
              onPress={handleMarkAsRead}
              disabled={isLoading}
              className="bg-blue-500 px-3 py-1 rounded-md"
              accessibilityLabel="Mark whisper as read"
            >
              <Text className="text-white text-xs">
                {isLoading ? 'Marking...' : 'Mark as Read'}
              </Text>
            </TouchableOpacity>
          )}

          {/* Echo Back button placeholder - disabled for MVP */}
          {FEATURE_FLAGS.CONVERSATION_EVOLUTION && (
            <TouchableOpacity
              disabled={true}
              className="bg-gray-300 px-3 py-1 rounded-md opacity-50"
              accessibilityLabel="Echo back (coming soon)"
            >
              <Text className="text-gray-500 text-xs">Echo Back</Text>
            </TouchableOpacity>
          )}

          {/* Read indicator */}
          {whisper.isRead && (
            <Text className="text-xs text-gray-400">Read</Text>
          )}
        </View>
      </View>
    </View>
  )
})

WhisperCard.displayName = 'WhisperCard'
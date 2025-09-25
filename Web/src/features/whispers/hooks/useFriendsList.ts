'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../../../Convex/convex/_generated/api'
import { Doc } from '../../../../../Convex/convex/_generated/dataModel'

/**
 * Custom hook for fetching the current user's friends list
 *
 * Uses Convex's real-time query system to automatically update
 * when the friends list changes
 *
 * @returns Object containing friends list, loading state, and error state
 */
export const useFriendsList = () => {
  const friends = useQuery(api.friends.getFriendsList) as Doc<'users'>[] | undefined
  const isLoading = friends === undefined
  const error = null // Convex queries handle errors internally

  return {
    friends: friends || [],
    isLoading,
    error,
  }
}

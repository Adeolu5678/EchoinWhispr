'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { useToast } from '@/hooks/use-toast'
import { useCallback, useMemo, useEffect, useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../../../Convex/convex/_generated/api'

/**
 * Custom hook for managing authentication status and user information
 * Provides unified access to Clerk and Convex authentication state
 * Automatically creates user in Convex when authenticated with Clerk
 *
 * @returns Object containing authentication state, user data, and actions
 */
export function useAuthStatus() {
  // Clerk authentication state
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser()
  const { signOut } = useAuth()

  // Convex authentication state
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } = useConvexAuth()

  // Toast hook for user feedback
  const { toast } = useToast()

  // Mutation for creating/getting user in Convex
  const getOrCreateUser = useMutation(api.users.getOrCreateCurrentUser)

  // Local state for user creation status
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [userCreationError, setUserCreationError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  // Combined loading state - wait for both Clerk and Convex to be ready
  const isLoading = !isClerkLoaded || isConvexLoading || isCreatingUser

  // Authentication status - user must be signed in to Clerk and authenticated with Convex
  // Wait for both systems to be ready before determining final authentication state
  const isAuthenticated = isSignedIn && isConvexAuthenticated && !isLoading

  // User information - safely extract user data from Clerk user object
  const user = useMemo(() => clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    fullName: clerkUser.fullName || '',
    username: clerkUser.username || '',
    imageUrl: clerkUser.imageUrl || '',
  } : null, [clerkUser])

import { useCallback, useMemo, useEffect, useState, useRef } from 'react'

  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Automatically create user in Convex when Clerk user is authenticated but Convex user doesn't exist
  useEffect(() => {
    const createUserIfNeeded = async () => {
      // Debug logging
      console.log('🔍 [useAuthStatus] createUserIfNeeded called with:', {
        isClerkLoaded,
        isSignedIn,
        isConvexAuthenticated,
        isCreatingUser,
        retryCount,
        maxRetries: MAX_RETRIES
      })

      // Only proceed if:
      // 1. Clerk user is loaded and signed in
      // 2. Convex is authenticated
      // 3. We're not already creating a user
      // 4. We haven't exceeded max retries
      if (!isClerkLoaded || !isSignedIn || !isConvexAuthenticated || isCreatingUser || retryCount >= MAX_RETRIES) {
        console.log('🚫 [useAuthStatus] Skipping user creation due to conditions:', {
          isClerkLoaded,
          isSignedIn,
          isConvexAuthenticated,
          isCreatingUser,
          retryCount
        })
        return
      }

      try {
        setIsCreatingUser(true)
        setUserCreationError(null)

        console.log('🚀 [useAuthStatus] Attempting to create/get user in Convex...')

        // Attempt to get or create the user in Convex
        const result = await getOrCreateUser()
        console.log('✅ [useAuthStatus] User creation successful:', result)

        // Reset retry count on success
        setRetryCount(0)
      } catch (error) {
        console.error('❌ [useAuthStatus] Error creating/getting user in Convex:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to sync user data'
        setUserCreationError(errorMessage)

        // Increment retry count
        const newRetryCount = retryCount + 1
        setRetryCount(newRetryCount)

        // Show error toast with retry information
        toast({
          title: 'Authentication Error',
          description: newRetryCount >= MAX_RETRIES
            ? 'There was an issue syncing your account. Please try refreshing the page.'
            : `There was an issue syncing your account. Retrying... (${newRetryCount}/${MAX_RETRIES})`,
          variant: 'destructive',
        })

        // Schedule retry with exponential backoff if we haven't exceeded max retries
        if (newRetryCount < MAX_RETRIES) {
          const delay = Math.pow(2, newRetryCount - 1) * 1000 // 1s, 2s, 4s
          console.log(`⏰ [useAuthStatus] Scheduling retry in ${delay}ms (attempt ${newRetryCount + 1}/${MAX_RETRIES})`)
          // Store the timeout ID so we can clear it on effect cleanup
          retryTimeoutRef.current = setTimeout(() => {
            // Only retry if user is still authenticated
            if (isSignedIn && isConvexAuthenticated) {
              console.log('🔄 [useAuthStatus] Retrying user creation...')
              createUserIfNeeded()
            } else {
              console.log('🚫 [useAuthStatus] Skipping retry - user no longer authenticated')
            }
          }, delay)
        }
      } finally {
        setIsCreatingUser(false)
      }
    }

    createUserIfNeeded()
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
    }
  }, [isClerkLoaded, isSignedIn, isConvexAuthenticated, retryCount, toast, getOrCreateUser])
  // Clear error when user successfully authenticates
  useEffect(() => {
    if (isAuthenticated && userCreationError) {
      setUserCreationError(null)
      setRetryCount(0)
    }
  }, [isAuthenticated, userCreationError])

  /**
   * Reset retry count and error state
   * Useful for manual retry attempts or when user wants to try again
   */
  const resetRetryState = useCallback(() => {
    setRetryCount(0)
    setUserCreationError(null)
  }, [])

  /**
   * Sign out the current user from both Clerk and Convex
   * Handles errors gracefully and provides user feedback via toast notifications
   */
  const handleSignOut = useCallback(async (): Promise<void> => {
    try {
      await signOut()
      // Clear any user creation errors on successful sign out
      setUserCreationError(null)
      toast({
        title: 'Signed out successfully',
        description: 'You have been signed out of your account.',
      })
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: 'Sign out failed',
        description: 'There was an error signing out. Please try again.',
        variant: 'destructive',
      })
      throw error
    }
  }, [signOut, toast])

  return {
    // Authentication state
    isAuthenticated,
    isLoading,
    isSignedIn,
    isConvexAuthenticated,

    // User data
    user,

    // User creation status
    isCreatingUser,
    userCreationError,
    retryCount,

    // Actions
    signOut: handleSignOut,
    resetRetryState,

    // Raw data for advanced use cases
    clerkUser,
    isClerkLoaded,
    isConvexLoading,
  }
}
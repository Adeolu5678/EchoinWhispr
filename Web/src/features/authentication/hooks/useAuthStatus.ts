'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { useToast } from '@/hooks/use-toast'
import { useCallback, useMemo, useEffect, useState, useRef } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/lib/convex'

/**
 * Interface representing the authenticated user data structure
 */
export interface AuthUser {
  id: string
  email: string
  fullName: string
  username: string
  imageUrl: string
  firstName?: string
  lastName?: string
}

/**
 * Interface representing the return type of the useAuthStatus hook
 */
export interface UseAuthStatusReturn {
  // Authentication state
  isAuthenticated: boolean
  isLoading: boolean
  isSignedIn: boolean
  isConvexAuthenticated: boolean

  // User data
  user: AuthUser | null

  // User creation status
  isProcessing: boolean
  userCreationError: string | null
  retryCount: number

  // Actions
  signOut: () => Promise<void>
  resetRetryState: () => void

  // Raw data for advanced use cases
  clerkUser: ReturnType<typeof useUser>['user']
  isClerkLoaded: boolean
  isConvexLoading: boolean
}

/**
 * Maximum retry attempts for user creation
 */
const MAX_RETRY_ATTEMPTS = 3

/**
 * Custom hook for managing authentication status and user information
 * Provides unified access to Clerk and Convex authentication state
 * Automatically creates user in Convex when authenticated with Clerk
 * Implements retry logic for user creation with proper state management
 *
 * @returns Object containing authentication state, user data, and actions
 */
export function useAuthStatus(): UseAuthStatusReturn {
  // Clerk authentication state
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser()
  const { signOut } = useAuth()

  // Convex authentication state
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } = useConvexAuth()

  // Toast hook for user feedback
  const { toast } = useToast()

  // Mutation for creating/getting user in Convex
  const getOrCreateUserMutation = useMutation(api.users.getOrCreateCurrentUser)

  // Memoized function to call the mutation with proper error handling
  const getOrCreateUser = useCallback(async () => {
    try {
      return await getOrCreateUserMutation()
    } catch (error) {
      console.error('Error in getOrCreateUser mutation:', error)
      throw error
    }
  }, [getOrCreateUserMutation])

  // State management - separated loading states to prevent circular dependencies
  const [isUserCreationLoading, setIsUserCreationLoading] = useState(false)
  const [userCreationError, setUserCreationError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Refs for values that shouldn't trigger re-renders but need to be accessed in effects
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isRetryingRef = useRef(false)

  // Computed authentication states using useMemo to prevent unnecessary recalculations
  const isLoading = useMemo(() => {
    return !isClerkLoaded || isConvexLoading || isUserCreationLoading
  }, [isClerkLoaded, isConvexLoading, isUserCreationLoading])

  const isAuthenticated = useMemo(() => {
    // Only consider authenticated if both systems are ready and user is signed in
    const signedIn = isSignedIn ?? false
    const convexAuth = isConvexAuthenticated ?? false
    const systemsReady = isClerkLoaded && !isConvexLoading

    return signedIn && convexAuth && systemsReady && !isLoading
  }, [isSignedIn, isConvexAuthenticated, isClerkLoaded, isConvexLoading, isLoading])

  // User information - safely extract user data from Clerk user object
  const user = useMemo(() => clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || '',
    fullName: clerkUser.fullName || '',
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    username: clerkUser.username || '',
    imageUrl: clerkUser.imageUrl || '',
  } : null, [clerkUser])

  // Retry function with proper state management and race condition prevention
  const retryUserCreation = useCallback(async (attemptNumber: number) => {
    // Prevent concurrent retries
    if (isRetryingRef.current) {
      return
    }

    isRetryingRef.current = true

    try {
      setIsUserCreationLoading(true)
      setUserCreationError(null)

      // Attempt to get or create the user in Convex
      const result = await getOrCreateUser()

      // Reset retry count and clear error on success
      setRetryCount(0)
      setUserCreationError(null)
    } catch (error) {
      console.error('Error creating/getting user in Convex:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to sync user data'
      setUserCreationError(errorMessage)

      // Increment retry count
      const newRetryCount = attemptNumber
      setRetryCount(newRetryCount)

      // Show error toast with retry information
      toast({
        title: 'Authentication Error',
        description: newRetryCount >= MAX_RETRY_ATTEMPTS
          ? 'Unable to sync your account after multiple attempts. Please try refreshing the page or contact support if the issue persists.'
          : `There was an issue syncing your account. Retrying... (${newRetryCount}/${MAX_RETRY_ATTEMPTS})`,
        variant: 'destructive',
      })

      // Schedule retry with exponential backoff if we haven't exceeded max retries
      if (newRetryCount < MAX_RETRY_ATTEMPTS) {
        const delay = Math.min(1000 * Math.pow(2, newRetryCount - 1), 30000) // Exponential backoff, max 30s

        retryTimeoutRef.current = setTimeout(() => {
          isRetryingRef.current = false
          retryUserCreation(newRetryCount + 1)
        }, delay)
      }
    } finally {
      setIsUserCreationLoading(false)
      isRetryingRef.current = false
    }
  }, [getOrCreateUser, toast])

  // Automatically create user in Convex when Clerk user is authenticated but Convex user doesn't exist
  useEffect(() => {
    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    const createUserIfNeeded = async () => {
      // Only proceed if:
      // 1. Clerk user is loaded and signed in
      // 2. Convex is authenticated
      // 3. We're not already processing
      // 4. We haven't exceeded max retries
      if (!isClerkLoaded ||
          !isSignedIn ||
          !isConvexAuthenticated ||
          isUserCreationLoading ||
          retryCount >= MAX_RETRY_ATTEMPTS) {
        return
      }

      await retryUserCreation(1)
    }

    createUserIfNeeded()

    // Cleanup function to clear timeout on unmount or dependency change
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
      isRetryingRef.current = false
    }
  }, [
    isClerkLoaded,
    isSignedIn,
    isConvexAuthenticated,
    retryCount,
    retryUserCreation
  ])

  // Clear error when user successfully authenticates and clean up state
  useEffect(() => {
    if (isAuthenticated && userCreationError) {
      setUserCreationError(null)
      setRetryCount(0)
      setIsUserCreationLoading(false)

      // Clear any pending retry
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
      isRetryingRef.current = false
    }
  }, [isAuthenticated, userCreationError])

  /**
   * Reset retry count and error state
   * Useful for manual retry attempts or when user wants to try again
   */
  const resetRetryState = useCallback(() => {
    // Clear any pending retry
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
    isRetryingRef.current = false

    setRetryCount(0)
    setUserCreationError(null)
    setIsUserCreationLoading(false)
  }, [])

  /**
   * Sign out the current user from both Clerk and Convex
   * Handles errors gracefully and provides user feedback via toast notifications
   */
  const handleSignOut = useCallback(async (): Promise<void> => {
    try {
      // Clear any pending retry before signing out
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
      isRetryingRef.current = false

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
    isSignedIn: isSignedIn ?? false,
    isConvexAuthenticated: isConvexAuthenticated ?? false,

    // User data
    user,

    // User creation status
    isProcessing: isUserCreationLoading,
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
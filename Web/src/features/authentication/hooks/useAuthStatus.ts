'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { useToast } from '@/hooks/use-toast'
import { useCallback, useMemo } from 'react'

/**
 * Custom hook for managing authentication status and user information
 * Provides unified access to Clerk and Convex authentication state
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

  // Combined loading state - wait for Clerk to be ready, Convex is optional for initial load
  const isLoading = !isClerkLoaded

  // Authentication status - user must be signed in to Clerk, Convex auth is checked separately
  const isAuthenticated = isSignedIn && isConvexAuthenticated

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

  /**
    * Sign out the current user from both Clerk and Convex
    * Handles errors gracefully and provides user feedback via toast notifications
    */
  const handleSignOut = useCallback(async (): Promise<void> => {
    try {
      await signOut()
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

    // Actions
    signOut: handleSignOut,

    // Raw data for advanced use cases
    clerkUser,
    isClerkLoaded,
    isConvexLoading,
  }
}
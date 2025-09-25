'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useConvexAuth } from 'convex/react'
import { useToast } from '@/hooks/use-toast'
import { useCallback, useMemo, useEffect, useState, useRef } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/lib/convex'

/**
 * Circuit breaker states for managing retry behavior
 */
export enum CircuitBreakerState {
  CLOSED = 'CLOSED',     // Normal operation, requests pass through
  OPEN = 'OPEN',         // Circuit is open, requests fail fast
  HALF_OPEN = 'HALF_OPEN' // Testing state, limited requests allowed
}

/**
 * Retry metadata for debugging and monitoring
 */
export interface RetryMetadata {
  attemptCount: number
  totalFailures: number
  lastFailureTime: number | null
  lastSuccessTime: number | null
  consecutiveFailures: number
  circuitBreakerState: CircuitBreakerState
  nextRetryTime: number | null
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number      // Number of consecutive failures to open circuit
  recoveryTimeout: number       // Time in ms before attempting recovery (HALF_OPEN)
  maxRetryAttempts: number      // Maximum retry attempts before giving up
  minRetryDelay: number         // Minimum delay between retries (ms)
  maxRetryDelay: number         // Maximum delay between retries (ms)
  jitterFactor: number          // Randomization factor for retry delays (0-1)
}

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
  isCreatingUser: boolean
  userCreationError: string | null
  retryCount: number

  // Circuit breaker and retry state
  circuitBreakerState: CircuitBreakerState
  retryMetadata: RetryMetadata
  isCircuitBreakerOpen: boolean

  // Actions
  signOut: () => Promise<void>
  resetRetryState: () => void
  resetCircuitBreaker: () => void

  // Raw data for advanced use cases
  clerkUser: ReturnType<typeof useUser>['user']
  isClerkLoaded: boolean
  isConvexLoading: boolean
}

/**
 * Default circuit breaker configuration
 */
const DEFAULT_CIRCUIT_BREAKER_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 3,          // Open circuit after 3 consecutive failures
  recoveryTimeout: 30000,       // Wait 30 seconds before attempting recovery
  maxRetryAttempts: 5,          // Maximum 5 retry attempts
  minRetryDelay: 1000,          // Minimum 1 second delay
  maxRetryDelay: 30000,         // Maximum 30 seconds delay
  jitterFactor: 0.1             // 10% randomization
}

/**
 * Calculate retry delay with exponential backoff and jitter
 * @param attempt - Current attempt number (1-based)
 * @param config - Circuit breaker configuration
 * @returns Delay in milliseconds
 */
function calculateRetryDelay(attempt: number, config: CircuitBreakerConfig): number {
  // Exponential backoff: baseDelay * 2^(attempt-1)
  const baseDelay = config.minRetryDelay
  const exponentialDelay = baseDelay * Math.pow(2, attempt - 1)

  // Cap at maximum delay
  const delay = Math.min(exponentialDelay, config.maxRetryDelay)

  // Add jitter to prevent thundering herd
  const jitter = delay * config.jitterFactor * (Math.random() - 0.5)
  const finalDelay = Math.max(config.minRetryDelay, delay + jitter)

  return Math.round(finalDelay)
}

/**
 * Custom hook for managing authentication status and user information
 * Provides unified access to Clerk and Convex authentication state
 * Automatically creates user in Convex when authenticated with Clerk
 * Implements circuit breaker pattern and enhanced retry logic
 *
 * @returns Object containing authentication state, user data, and actions
 */
export function useAuthStatus(): UseAuthStatusReturn {
  // Clerk authentication state
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser()
  const { signOut } = useAuth()

  // Convex authentication state
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } = useConvexAuth()

  // Toast hook for user feedback - memoized to prevent unnecessary re-renders
  const { toast } = useToast()
  const memoizedToast = useCallback((options: Parameters<typeof toast>[0]) => {
    toast(options)
  }, [toast])

  // Mutation for creating/getting user in Convex - stable reference to prevent infinite re-renders
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

  // Circuit breaker configuration
  const circuitBreakerConfig = useMemo(() => DEFAULT_CIRCUIT_BREAKER_CONFIG, [])

  // Circuit breaker state management
  const [circuitBreakerState, setCircuitBreakerState] = useState<CircuitBreakerState>(
    CircuitBreakerState.CLOSED
  )
  const [consecutiveFailures, setConsecutiveFailures] = useState(0)
  const [lastFailureTime, setLastFailureTime] = useState<number | null>(null)
  const [lastSuccessTime, setLastSuccessTime] = useState<number | null>(null)
  const [nextRetryTime, setNextRetryTime] = useState<number | null>(null)

  // Separate, independent loading states to prevent circular dependencies
  const [isInitializing, setIsInitializing] = useState(true)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [userCreationError, setUserCreationError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Timeout references for cleanup
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const circuitBreakerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // State transition guard to prevent rapid changes
  const [lastAuthState, setLastAuthState] = useState<{
    isSignedIn: boolean | null
    isConvexAuthenticated: boolean | null
    timestamp: number
  }>({
    isSignedIn: null,
    isConvexAuthenticated: null,
    timestamp: 0
  })

  // Debounce state changes to prevent rapid transitions
  const stateTransitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Computed authentication states using useMemo to prevent unnecessary recalculations
  const isLoading = useMemo(() => {
    return !isClerkLoaded || isConvexLoading || isCreatingUser || isAuthenticating
  }, [isClerkLoaded, isConvexLoading, isCreatingUser, isAuthenticating])

  const isAuthenticated = useMemo(() => {
    // Only consider authenticated if both systems are ready and user is signed in
    const signedIn = isSignedIn ?? false
    const convexAuth = isConvexAuthenticated ?? false
    const systemsReady = isClerkLoaded && !isConvexLoading

    return signedIn && convexAuth && systemsReady && !isLoading
  }, [isSignedIn, isConvexAuthenticated, isClerkLoaded, isConvexLoading, isLoading])

  // Check if authentication state has changed significantly
  const hasAuthStateChanged = useMemo(() => {
    const currentState = {
      isSignedIn: isSignedIn ?? false,
      isConvexAuthenticated: isConvexAuthenticated ?? false
    }

    const hasChanged = JSON.stringify(currentState) !== JSON.stringify({
      isSignedIn: lastAuthState.isSignedIn,
      isConvexAuthenticated: lastAuthState.isConvexAuthenticated
    })

    return hasChanged
  }, [isSignedIn, isConvexAuthenticated, lastAuthState])

  // Circuit breaker computed states
  const isCircuitBreakerOpen = useMemo(() => {
    return circuitBreakerState === CircuitBreakerState.OPEN
  }, [circuitBreakerState])

  // Retry metadata for debugging and monitoring
  const retryMetadata = useMemo((): RetryMetadata => ({
    attemptCount: retryCount,
    totalFailures: consecutiveFailures,
    lastFailureTime,
    lastSuccessTime,
    consecutiveFailures,
    circuitBreakerState,
    nextRetryTime
  }), [retryCount, consecutiveFailures, lastFailureTime, lastSuccessTime, circuitBreakerState, nextRetryTime])

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

  // Circuit breaker helper functions
  const openCircuitBreaker = useCallback(() => {
    console.log('🔴 [CircuitBreaker] Opening circuit breaker')
    setCircuitBreakerState(CircuitBreakerState.OPEN)
    setLastFailureTime(Date.now())

    // Schedule recovery attempt
    const recoveryTime = Date.now() + circuitBreakerConfig.recoveryTimeout
    setNextRetryTime(recoveryTime)

    circuitBreakerTimeoutRef.current = setTimeout(() => {
      console.log('🟡 [CircuitBreaker] Transitioning to HALF_OPEN state')
      setCircuitBreakerState(CircuitBreakerState.HALF_OPEN)
      setNextRetryTime(null)
    }, circuitBreakerConfig.recoveryTimeout)
  }, [circuitBreakerConfig.recoveryTimeout])

  const closeCircuitBreaker = useCallback(() => {
    console.log('🟢 [CircuitBreaker] Closing circuit breaker')
    setCircuitBreakerState(CircuitBreakerState.CLOSED)
    setConsecutiveFailures(0)
    setLastSuccessTime(Date.now())
    setNextRetryTime(null)

    // Clear any pending recovery timeout
    if (circuitBreakerTimeoutRef.current) {
      clearTimeout(circuitBreakerTimeoutRef.current)
      circuitBreakerTimeoutRef.current = null
    }
  }, [])

  const recordFailure = useCallback(() => {
    const newConsecutiveFailures = consecutiveFailures + 1
    setConsecutiveFailures(newConsecutiveFailures)
    setLastFailureTime(Date.now())

    console.log(`❌ [CircuitBreaker] Recorded failure ${newConsecutiveFailures}/${circuitBreakerConfig.failureThreshold}`)

    // Open circuit breaker if failure threshold is reached
    if (newConsecutiveFailures >= circuitBreakerConfig.failureThreshold) {
      openCircuitBreaker()
    }
  }, [consecutiveFailures, circuitBreakerConfig.failureThreshold, openCircuitBreaker])

  const recordSuccess = useCallback(() => {
    console.log('✅ [CircuitBreaker] Recorded success')
    setConsecutiveFailures(0)
    setLastSuccessTime(Date.now())

    // Close circuit breaker on success (especially important in HALF_OPEN state)
    if (circuitBreakerState !== CircuitBreakerState.CLOSED) {
      closeCircuitBreaker()
    }
  }, [circuitBreakerState, closeCircuitBreaker])

  // Reset circuit breaker manually
  const resetCircuitBreaker = useCallback(() => {
    console.log('🔄 [CircuitBreaker] Manual reset')
    setCircuitBreakerState(CircuitBreakerState.CLOSED)
    setConsecutiveFailures(0)
    setLastFailureTime(null)
    setLastSuccessTime(null)
    setNextRetryTime(null)

    // Clear any pending timeouts
    if (circuitBreakerTimeoutRef.current) {
      clearTimeout(circuitBreakerTimeoutRef.current)
      circuitBreakerTimeoutRef.current = null
    }
  }, [])

  // State transition guard to prevent rapid changes
  useEffect(() => {
    const now = Date.now()
    const timeSinceLastChange = now - lastAuthState.timestamp

    // Debounce rapid state changes (minimum 500ms between transitions)
    if (timeSinceLastChange < 500) {
      const remainingTime = 500 - timeSinceLastChange
      if (stateTransitionTimeoutRef.current) {
        clearTimeout(stateTransitionTimeoutRef.current)
      }

      stateTransitionTimeoutRef.current = setTimeout(() => {
        setLastAuthState({
          isSignedIn: isSignedIn ?? false,
          isConvexAuthenticated: isConvexAuthenticated ?? false,
          timestamp: Date.now()
        })
      }, remainingTime)
      return
    }

    setLastAuthState({
      isSignedIn: isSignedIn ?? false,
      isConvexAuthenticated: isConvexAuthenticated ?? false,
      timestamp: now
    })
  }, [isSignedIn, isConvexAuthenticated, lastAuthState.timestamp])

  // Automatically create user in Convex when Clerk user is authenticated but Convex user doesn't exist
  useEffect(() => {
    const createUserIfNeeded = async () => {
      // Debug logging
      console.log('🔍 [useAuthStatus] createUserIfNeeded called with:', {
        isClerkLoaded,
        isSignedIn,
        isConvexAuthenticated,
        isCreatingUser,
        isAuthenticating,
        retryCount,
        maxRetries: circuitBreakerConfig.maxRetryAttempts,
        hasAuthStateChanged,
        circuitBreakerState,
        consecutiveFailures
      })

      // Only proceed if:
      // 1. Clerk user is loaded and signed in
      // 2. Convex is authenticated
      // 3. We're not already creating a user or authenticating
      // 4. We haven't exceeded max retries
      // 5. Authentication state has actually changed (not just a rapid transition)
      // 6. Circuit breaker is not open (or we're in HALF_OPEN state for testing)
      if (!isClerkLoaded ||
          !isSignedIn ||
          !isConvexAuthenticated ||
          isCreatingUser ||
          isAuthenticating ||
          retryCount >= circuitBreakerConfig.maxRetryAttempts ||
          !hasAuthStateChanged ||
          (circuitBreakerState === CircuitBreakerState.OPEN)) {
        console.log('🚫 [useAuthStatus] Skipping user creation due to conditions:', {
          isClerkLoaded,
          isSignedIn,
          isConvexAuthenticated,
          isCreatingUser,
          isAuthenticating,
          retryCount,
          maxRetries: circuitBreakerConfig.maxRetryAttempts,
          hasAuthStateChanged,
          circuitBreakerState,
          consecutiveFailures
        })
        return
      }

      try {
        setIsCreatingUser(true)
        setIsAuthenticating(true)
        setUserCreationError(null)

        console.log('🚀 [useAuthStatus] Attempting to create/get user in Convex...')

        // Attempt to get or create the user in Convex
        const result = await getOrCreateUser()
        console.log('✅ [useAuthStatus] User creation successful:', result)

        // Record success for circuit breaker
        recordSuccess()

        // Reset retry count and clear error on success
        setRetryCount(0)
        setUserCreationError(null)
      } catch (error) {
        console.error('❌ [useAuthStatus] Error creating/getting user in Convex:', error)
        const errorMessage = error instanceof Error ? error.message : 'Failed to sync user data'
        setUserCreationError(errorMessage)

        // Record failure for circuit breaker
        recordFailure()

        // Increment retry count
        const newRetryCount = retryCount + 1
        setRetryCount(newRetryCount)

        // Show error toast with retry information
        const shouldShowToast = circuitBreakerState !== CircuitBreakerState.OPEN
        if (shouldShowToast) {
          toast({
            title: 'Authentication Error',
            description: newRetryCount >= circuitBreakerConfig.maxRetryAttempts
              ? 'Unable to sync your account after multiple attempts. Please try refreshing the page or contact support if the issue persists.'
              : `There was an issue syncing your account. Retrying... (${newRetryCount}/${circuitBreakerConfig.maxRetryAttempts})`,
            variant: 'destructive',
          })
        }

        // Schedule retry with enhanced exponential backoff if we haven't exceeded max retries
        // and circuit breaker is not open
        if (newRetryCount < circuitBreakerConfig.maxRetryAttempts &&
            circuitBreakerState !== CircuitBreakerState.OPEN) {
          const delay = calculateRetryDelay(newRetryCount, circuitBreakerConfig)
          const nextRetryAt = Date.now() + delay

          console.log(`⏰ [useAuthStatus] Scheduling retry in ${delay}ms (attempt ${newRetryCount + 1}/${circuitBreakerConfig.maxRetryAttempts})`)
          setNextRetryTime(nextRetryAt)

          // Store the timeout ID so we can clear it on effect cleanup
          retryTimeoutRef.current = setTimeout(() => {
            // Only retry if user is still authenticated and no other processes are running
            if (isSignedIn && isConvexAuthenticated && !isCreatingUser && !isAuthenticating) {
              console.log('🔄 [useAuthStatus] Retrying user creation...')
              createUserIfNeeded()
            } else {
              console.log('🚫 [useAuthStatus] Skipping retry - user no longer authenticated or another process is running')
            }
          }, delay)
        } else if (circuitBreakerState === CircuitBreakerState.OPEN) {
          console.log('🚫 [useAuthStatus] Circuit breaker is OPEN - no more retries will be attempted')
          toast({
            title: 'Service Temporarily Unavailable',
            description: 'The authentication service is temporarily unavailable. Please try again in a few moments.',
            variant: 'destructive',
          })
        }
      } finally {
        setIsCreatingUser(false)
        setIsAuthenticating(false)
      }
    }

    createUserIfNeeded()
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
      if (circuitBreakerTimeoutRef.current) {
        clearTimeout(circuitBreakerTimeoutRef.current)
        circuitBreakerTimeoutRef.current = null
      }
      if (stateTransitionTimeoutRef.current) {
        clearTimeout(stateTransitionTimeoutRef.current)
        stateTransitionTimeoutRef.current = null
      }
    }
  }, [
    isClerkLoaded,
    isSignedIn,
    isConvexAuthenticated,
    retryCount,
    memoizedToast,
    hasAuthStateChanged,
    circuitBreakerState,
    circuitBreakerConfig,
    recordSuccess,
    recordFailure,
    getOrCreateUser
  ])

  // Clear error when user successfully authenticates and clean up state
  useEffect(() => {
    if (isAuthenticated && userCreationError) {
      setUserCreationError(null)
      setRetryCount(0)
      setIsCreatingUser(false)
      setIsAuthenticating(false)
    }
  }, [isAuthenticated, userCreationError])

  // Cleanup function to reset all states when component unmounts
  useEffect(() => {
    return () => {
      // Clear any pending timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
        retryTimeoutRef.current = null
      }
      if (circuitBreakerTimeoutRef.current) {
        clearTimeout(circuitBreakerTimeoutRef.current)
        circuitBreakerTimeoutRef.current = null
      }
      if (stateTransitionTimeoutRef.current) {
        clearTimeout(stateTransitionTimeoutRef.current)
        stateTransitionTimeoutRef.current = null
      }

      // Reset all states to prevent memory leaks
      setIsCreatingUser(false)
      setIsAuthenticating(false)
      setUserCreationError(null)
      setRetryCount(0)
      setConsecutiveFailures(0)
      setCircuitBreakerState(CircuitBreakerState.CLOSED)
      setLastFailureTime(null)
      setLastSuccessTime(null)
      setNextRetryTime(null)
    }
  }, [])

  /**
   * Reset retry count and error state
   * Useful for manual retry attempts or when user wants to try again
   */
  const resetRetryState = useCallback(() => {
    setRetryCount(0)
    setUserCreationError(null)
    setConsecutiveFailures(0)
    setLastFailureTime(null)
    setNextRetryTime(null)

    // Clear any pending retry timeouts
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }
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
    isSignedIn: isSignedIn ?? false,
    isConvexAuthenticated: isConvexAuthenticated ?? false,

    // User data
    user,

    // User creation status (separated for clarity)
    isCreatingUser,
    isAuthenticating,
    userCreationError,
    retryCount,

    // Circuit breaker and retry state
    circuitBreakerState,
    retryMetadata,
    isCircuitBreakerOpen,

    // Actions
    signOut: handleSignOut,
    resetRetryState,
    resetCircuitBreaker,

    // Raw data for advanced use cases
    clerkUser,
    isClerkLoaded,
    isConvexLoading,
  }
}
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/lib/convex'
import { useToast } from '@/hooks/use-toast'

/**
 * Username validation status types
 */
export type UsernameValidationStatus = 'idle' | 'validating' | 'available' | 'unavailable' | 'invalid'

/**
 * Interface representing the return type of the useUsernameValidation hook
 */
export interface UseUsernameValidationReturn {
  // Current validation state
  status: UsernameValidationStatus
  errorMessage: string | null
  isValid: boolean
  isAvailable: boolean | null

  // Actions
  validateUsername: (username: string) => void
  clearValidation: () => void

  // Debounced validation
  debouncedUsername: string
  isDebouncing: boolean
}

/**
 * Username validation rules
 */
const USERNAME_RULES = {
  MIN_LENGTH: 3,
  MAX_LENGTH: 20,
  PATTERN: /^[a-z0-9_]+$/,
} as const

/**
 * Custom hook for validating usernames with real-time feedback
 * Provides debounced validation, availability checking, and comprehensive error handling
 *
 * @returns Object containing validation state, actions, and debounced username
 */
export function useUsernameValidation(): UseUsernameValidationReturn {
  // Local state for validation
  const [username, setUsername] = useState('')
  const [debouncedUsername, setDebouncedUsername] = useState('')
  const [isDebouncing, setIsDebouncing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Toast hook for user feedback
  const { toast } = useToast()

  // Convex query for checking username availability
  const checkUsernameAvailability = useQuery(
    api.users.getUserByUsername,
    debouncedUsername ? { username: debouncedUsername } : 'skip'
  )

  // Debounce username input (500ms delay)
  useEffect(() => {
    setIsDebouncing(true)
    const timer = setTimeout(() => {
      setDebouncedUsername(username)
      setIsDebouncing(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [username])

  // Validate username format
  const validateFormat = useCallback((inputUsername: string): boolean => {
    if (inputUsername.length < USERNAME_RULES.MIN_LENGTH) {
      setErrorMessage(`Username must be at least ${USERNAME_RULES.MIN_LENGTH} characters long`)
      return false
    }

    if (inputUsername.length > USERNAME_RULES.MAX_LENGTH) {
      setErrorMessage(`Username must be no more than ${USERNAME_RULES.MAX_LENGTH} characters long`)
      return false
    }

    if (!USERNAME_RULES.PATTERN.test(inputUsername)) {
      setErrorMessage('Username can only contain lowercase letters, numbers, and underscores')
      return false
    }

    setErrorMessage(null)
    return true
  }, [])

  // Determine validation status based on current state
  const status = useMemo<UsernameValidationStatus>(() => {
    if (!username) return 'idle'

    if (isDebouncing) return 'validating'

    if (!validateFormat(username)) return 'invalid'

    if (checkUsernameAvailability === undefined) return 'validating'

    if (checkUsernameAvailability === null) return 'available'

    return 'unavailable'
  }, [username, isDebouncing, checkUsernameAvailability, validateFormat])

  // Determine if username is valid and available
  const isValid = useMemo(() => {
    return status === 'available'
  }, [status])

  const isAvailable = useMemo(() => {
    if (status === 'available') return true
    if (status === 'unavailable') return false
    return null
  }, [status])

  /**
   * Validate a username with real-time feedback
   * Updates internal state and triggers validation checks
   *
   * @param inputUsername - The username to validate
   */
  const validateUsername = useCallback((inputUsername: string) => {
    const trimmedUsername = inputUsername.trim().toLowerCase()
    setUsername(trimmedUsername)

    // Clear previous error messages
    setErrorMessage(null)

    // Immediate format validation
    if (trimmedUsername && !validateFormat(trimmedUsername)) {
      return
    }

    // Show validation feedback for valid format
    if (trimmedUsername && validateFormat(trimmedUsername)) {
      // Validation will continue via the debounced effect
    }
  }, [validateFormat])

  /**
   * Clear all validation state
   * Useful for resetting the form or when modal is closed
   */
  const clearValidation = useCallback(() => {
    setUsername('')
    setDebouncedUsername('')
    setErrorMessage(null)
    setIsDebouncing(false)
  }, [])

  // Handle validation errors
  useEffect(() => {
    if (checkUsernameAvailability === undefined && debouncedUsername) {
      // Still validating
      return
    }

    if (checkUsernameAvailability !== null && debouncedUsername) {
      // Username is taken
      setErrorMessage('This username is already taken')
    }
  }, [checkUsernameAvailability, debouncedUsername])

  // Handle network errors
  useEffect(() => {
    if (checkUsernameAvailability === undefined && debouncedUsername && !isDebouncing) {
      // This might indicate a network error or the query failed
      console.warn('Username availability check returned undefined, possible network error')
    }
  }, [checkUsernameAvailability, debouncedUsername, isDebouncing])

  return {
    // Current validation state
    status,
    errorMessage,
    isValid,
    isAvailable,

    // Actions
    validateUsername,
    clearValidation,

    // Debounced validation
    debouncedUsername,
    isDebouncing,
  }
}
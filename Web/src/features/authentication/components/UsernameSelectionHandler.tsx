'use client'

import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import { useAuthStatus } from '../hooks/useAuthStatus'
import { UsernamePickerModal } from './UsernamePickerModal'

/**
 * Component that handles the integration of UsernamePickerModal into the authentication flow
 * This component should be placed in the main layout or authentication flow to handle
 * username selection when needed for new users
 */
export function UsernameSelectionHandler(): JSX.Element | null {
  const {
    isUsernameSelectionOpen,
    showUsernamePicker,
    hideUsernamePicker,
    isLoading,
    isAuthenticated,
    user,
  } = useAuthStatus()

  // Use refs to track initialization and prevent unnecessary re-renders
  const hasTriggeredModal = useRef<boolean>(false)
  const hasInitialized = useRef<boolean>(false)

  // Check if user is new by comparing creation time with current time
  // If user was created within the last 5 minutes, consider them new
  const isUserNew = useMemo(() => {
    if (!user?.createdAt) return false
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
    return user.createdAt > fiveMinutesAgo
  }, [user?.createdAt])

  // Only show the modal when:
  // 1. User is new (created within last 5 minutes)
  // 2. User is authenticated but doesn't have a username
  // 3. Modal is explicitly opened
  const shouldShowModal = isUserNew && isUsernameSelectionOpen

  // Reset the trigger flag when modal state changes
  useEffect(() => {
    if (!isUsernameSelectionOpen) {
      hasTriggeredModal.current = false
    }
  }, [isUsernameSelectionOpen])

  // If user is new but modal is not open, show it
  // Use useEffect with proper guards to prevent infinite re-renders
  useEffect(() => {
    // Only trigger if user is new and modal is not already open
    if (isUserNew && !isUsernameSelectionOpen && !hasTriggeredModal.current) {
      hasTriggeredModal.current = true
      showUsernamePicker()
    }
  }, [isUserNew, isUsernameSelectionOpen, showUsernamePicker])

  // If user is already authenticated and has a username, don't render anything
  if (isAuthenticated && user?.username) {
    return null
  }

  // If user is not authenticated or loading, don't render anything
  if (!isAuthenticated || isLoading) {
    return null
  }

  // Show the modal when needed
  if (shouldShowModal) {
    return (
      <UsernamePickerModal
        isOpen={isUsernameSelectionOpen}
        onClose={hideUsernamePicker}
        onSuccess={() => {
          // Refresh user data after successful username selection
          // The modal handles the username update internally
          setTimeout(() => {
            window.location.reload() // Simple refresh to get updated user data
          }, 1000)
        }}
      />
    )
  }

  return null
}
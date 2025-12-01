'use client';

import { useEffect, useRef } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { UsernamePickerModal } from './UsernamePickerModal';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';

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
  } = useAuthStatus();

  // Query to check if user needs username selection
  const needsUsernameSelection = useQuery(
    api.users.getUserNeedsUsernameSelection
  );

  // Use refs to track initialization and prevent unnecessary re-renders
  const hasTriggeredModal = useRef<boolean>(false);

  // Only show the modal when:
  // 1. User needs username selection (database flag is true)
  // 2. User is authenticated but doesn't have a username
  // Note: Modal visibility is controlled by isUsernameSelectionOpen state
  const shouldShowModal = needsUsernameSelection === true;

  // Reset the trigger flag when modal state changes
  useEffect(() => {
    if (!isUsernameSelectionOpen) {
      hasTriggeredModal.current = false;
    }
  }, [isUsernameSelectionOpen]);

  // If user needs username selection but modal is not open, show it
  // Use useEffect with proper guards to prevent infinite re-renders
  useEffect(() => {
    // Only trigger if user needs username selection and modal is not already open
    if (
      needsUsernameSelection === true &&
      !isUsernameSelectionOpen &&
      !hasTriggeredModal.current
    ) {
      hasTriggeredModal.current = true;
      showUsernamePicker();
    }
  }, [needsUsernameSelection, isUsernameSelectionOpen, showUsernamePicker]);

  // If user is already authenticated and has a username, don't render anything
  if (isAuthenticated && user?.username) {
    return null;
  }

  // If user is not authenticated or loading, don't render anything
  if (!isAuthenticated || isLoading) {
    return null;
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
            window.location.reload(); // Simple refresh to get updated user data
          }, 1000);
        }}
      />
    );
  }

  return null;
}

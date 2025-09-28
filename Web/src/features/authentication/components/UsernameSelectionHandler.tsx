'use client';

import { useEffect, useRef } from 'react';
import { useAuthStatus } from '../hooks/useAuthStatus';
import { UsernamePickerModal } from './UsernamePickerModal';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';

/**
 * Orchestrates automatic display of the username picker modal for authenticated users who need to select a username.
 *
 * Shows the UsernamePickerModal when the current user requires a username, wires the modal's open/close handlers, and reloads the page after a successful selection to refresh user data.
 *
 * @returns The UsernamePickerModal element when it should be shown, otherwise `null`.
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

  console.log(
    'DEBUG: UsernameSelectionHandler - needsUsernameSelection:',
    needsUsernameSelection,
    'isUsernameSelectionOpen:',
    isUsernameSelectionOpen,
    'shouldShowModal:',
    shouldShowModal,
    'hasTriggeredModal:',
    hasTriggeredModal.current
  );

  // Reset the trigger flag when modal state changes
  useEffect(() => {
    if (!isUsernameSelectionOpen) {
      hasTriggeredModal.current = false;
    }
  }, [isUsernameSelectionOpen]);

  // If user needs username selection but modal is not open, show it
  // Use useEffect with proper guards to prevent infinite re-renders
  useEffect(() => {
    console.log(
      'DEBUG: UsernameSelectionHandler useEffect - needsUsernameSelection:',
      needsUsernameSelection,
      'isUsernameSelectionOpen:',
      isUsernameSelectionOpen,
      'hasTriggeredModal:',
      hasTriggeredModal.current
    );

    // Only trigger if user needs username selection and modal is not already open
    if (
      needsUsernameSelection === true &&
      !isUsernameSelectionOpen &&
      !hasTriggeredModal.current
    ) {
      console.log('DEBUG: UsernameSelectionHandler - Triggering modal display');
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
          console.log(
            'DEBUG: UsernameSelectionHandler - Username selection successful'
          );
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

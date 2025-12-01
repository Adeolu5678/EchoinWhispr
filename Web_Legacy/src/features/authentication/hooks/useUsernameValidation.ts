'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';

/**
 * Username validation status types
 */
export type UsernameValidationStatus =
  | 'idle'
  | 'validating'
  | 'available'
  | 'unavailable'
  | 'invalid';

/**
 * Interface representing the return type of the useUsernameValidation hook
 */
export interface UseUsernameValidationReturn {
  // Current validation state
  status: UsernameValidationStatus;
  errorMessage: string | null;
  isValid: boolean;
  isAvailable: boolean | null;

  // Actions
  validateUsername: (username: string) => void;
  clearValidation: () => void;

  // Debounced validation
  debouncedUsername: string;
  isDebouncing: boolean;
}



/**
 * Custom hook for validating usernames with real-time feedback
 * Provides debounced validation, availability checking, and comprehensive error handling
 *
 * @returns Object containing validation state, actions, and debounced username
 */
export function useUsernameValidation(): UseUsernameValidationReturn {
  // Local state for validation
  const [username, setUsername] = useState('');
  const [debouncedUsername, setDebouncedUsername] = useState('');
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Convex query for checking username availability
  const checkUsernameAvailability = useQuery(
    api.users.getUserByUsername,
    debouncedUsername ? { username: debouncedUsername } : 'skip'
  );

  // Debounce username input (500ms delay)
  useEffect(() => {
    setIsDebouncing(true);
    const timer = setTimeout(() => {
      setDebouncedUsername(username);
      setIsDebouncing(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Note: Format validation is now handled in the component to avoid render-phase state updates

  // Determine validation status based on current state
  const status = useMemo<UsernameValidationStatus>(() => {
    if (!username) return 'idle';

    if (isDebouncing) return 'validating';

    if (checkUsernameAvailability === undefined) return 'validating';

    if (checkUsernameAvailability === null) return 'available';

    return 'unavailable';
  }, [username, isDebouncing, checkUsernameAvailability]);

  // Determine if username is valid and available
  const isValid = useMemo(() => {
    return status === 'available';
  }, [status]);

  const isAvailable = useMemo(() => {
    if (status === 'available') return true;
    if (status === 'unavailable') return false;
    return null;
  }, [status]);

  /**
   * Validate a username with real-time feedback
    * Updates internal state and triggers validation checks
    *
    * @param inputUsername - The username to validate
    */
   const validateUsername = useCallback(
     (inputUsername: string) => {
       const trimmedUsername = inputUsername.trim().toLowerCase();
       setUsername(trimmedUsername);

       // Clear previous error messages
       setErrorMessage(null);

       // Validation will continue via the debounced effect
     },
     []
   );

  /**
   * Clear all validation state
   * Useful for resetting the form or when modal is closed
   */
  const clearValidation = useCallback(() => {
    setUsername('');
    setDebouncedUsername('');
    setErrorMessage(null);
    setIsDebouncing(false);
  }, []);

  // Handle validation errors
  useEffect(() => {
    if (checkUsernameAvailability === undefined && debouncedUsername) {
      // Still validating
      return;
    }

    if (checkUsernameAvailability !== null && debouncedUsername) {
      // Username is taken
      setErrorMessage('This username is already taken');
    }
  }, [checkUsernameAvailability, debouncedUsername]);

  // Handle network errors
  useEffect(() => {
    if (
      checkUsernameAvailability === undefined &&
      debouncedUsername &&
      !isDebouncing
    ) {
      // This might indicate a network error or the query failed
      console.warn(
        'Username availability check returned undefined, possible network error'
      );
    }
  }, [checkUsernameAvailability, debouncedUsername, isDebouncing]);

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
  };
}

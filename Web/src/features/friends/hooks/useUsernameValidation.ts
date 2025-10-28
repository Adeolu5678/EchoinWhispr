import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseUsernameValidationReturn {
  validateUsername: (username: string) => Promise<boolean>;
  isValidating: boolean;
}

/**
 * Hook for username validation logic.
 * Provides functions to validate usernames according to application rules.
 */
export const useUsernameValidation = (): UseUsernameValidationReturn => {
  const { toast } = useToast();

  const validateUsername = useCallback(
    async (username: string): Promise<boolean> => {
      try {
        // Basic validation rules
        if (!username || username.trim().length === 0) {
          toast({
            title: 'Invalid username',
            description: 'Username cannot be empty',
            variant: 'destructive',
          });
          return false;
        }

        const trimmedUsername = username.trim();

        // Length validation
        if (trimmedUsername.length < 3) {
          toast({
            title: 'Invalid username',
            description: 'Username must be at least 3 characters long',
            variant: 'destructive',
          });
          return false;
        }

        if (trimmedUsername.length > 20) {
          toast({
            title: 'Invalid username',
            description: 'Username cannot exceed 20 characters',
            variant: 'destructive',
          });
          return false;
        }

        // Character validation - alphanumeric and underscores only
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(trimmedUsername)) {
          toast({
            title: 'Invalid username',
            description: 'Username can only contain letters, numbers, and underscores',
            variant: 'destructive',
          });
          return false;
        }

        // Check for reserved words (basic check)
        const reservedWords = ['admin', 'system', 'null', 'undefined', 'root'];
        if (reservedWords.includes(trimmedUsername.toLowerCase())) {
          toast({
            title: 'Invalid username',
            description: 'This username is reserved',
            variant: 'destructive',
          });
          return false;
        }

        // Check against Convex database for uniqueness
        // Note: checkUsernameAvailability query doesn't exist yet, so we'll skip this check for now
        const isAvailable = true; // Placeholder - assume available

        if (!isAvailable) {
          toast({
            title: 'Username taken',
            description: 'This username is already taken. Please choose another one.',
            variant: 'destructive',
          });
          return false;
        }

        return true;
      } catch (error) {
        console.error('Username validation error:', error);
        toast({
          title: 'Validation error',
          description: 'Failed to validate username',
          variant: 'destructive',
        });
        return false;
      }
    },
    [toast]
  );

  return {
    validateUsername,
    isValidating: false,
  };
};
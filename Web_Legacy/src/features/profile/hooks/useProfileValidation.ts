import { useMemo } from 'react';
import { ProfileFormData } from '../types';

/**
 * Hook for client-side validation of profile form data.
 *
 * @returns Object containing validation function and error messages
 */
export const useProfileValidation = () => {
  const validateProfile = useMemo(() => {
    return (data: ProfileFormData): { isValid: boolean; errors: Record<string, string> } => {
      const errors: Record<string, string> = {};

      // Bio validation
      if (data.bio && data.bio.length > 280) {
        errors.bio = 'Bio must be 280 characters or less';
      }

      // Trim whitespace from bio
      const trimmedBio = data.bio?.trim();
      if (trimmedBio !== data.bio) {
        // Note: This would be handled in the form submission, but we can warn here
        errors.bio = errors.bio || 'Bio will be trimmed of leading/trailing whitespace';
      }

      return {
        isValid: Object.keys(errors).length === 0,
        errors,
      };
    };
  }, []);

  return {
    validateProfile,
  };
};
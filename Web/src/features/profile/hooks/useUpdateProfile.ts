import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import { ProfileUpdateData } from '../types';

/**
 * Hook to update the current user's profile data.
 *
 * @returns Object containing update function, loading state, and error state
 */
export const useUpdateProfile = () => {
  const updateProfileMutation = useMutation(api.profiles.updateProfile);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateProfile = async (data: ProfileUpdateData) => {
    setIsLoading(true);

    try {
      // Trim whitespace from bio
      const trimmedData = {
        ...data,
        bio: data.bio?.trim(),
      };

      await updateProfileMutation(trimmedData);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });

      return { success: true };
    } catch (error) {
      console.error('Failed to update profile:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred while updating your profile.';

      toast({
        title: 'Update failed',
        description: errorMessage,
        variant: 'destructive',
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading,
  };
};
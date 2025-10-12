import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import { useFileUpload } from '@/hooks/useFileUpload';

/**
 * Hook to handle profile picture upload functionality.
 * Combines file upload with profile update operations.
 *
 * @returns Object containing upload function, loading state, and error state
 */
export const useUploadProfilePicture = () => {
  const updateProfileMutation = useMutation(api.profiles.updateProfile);
  const { upload: uploadFile, isUploading, error: uploadError, reset: resetUpload } = useFileUpload();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const uploadProfilePicture = async (file: File): Promise<void> => {
    try {
      // Upload the file first
      const { url } = await uploadFile(file);

      // Update the profile with the new avatar URL
      setIsUpdating(true);
      await updateProfileMutation({
        avatarUrl: url,
      });

      toast({
        title: 'Profile picture updated',
        description: 'Your profile picture has been successfully updated.',
      });

      // Reset upload state
      resetUpload();
    } catch (error) {
      console.error('Failed to upload profile picture:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : 'An unexpected error occurred while uploading your profile picture.';

      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive',
      });

      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    uploadProfilePicture,
    isUploading: isUploading || isUpdating,
    error: uploadError,
  };
};
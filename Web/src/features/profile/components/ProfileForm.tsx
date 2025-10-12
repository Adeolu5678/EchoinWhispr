'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ProfileFormProps } from '../types';
import { useToast } from '@/hooks/use-toast';

// Validation schema for profile form
const profileFormSchema = z.object({
  bio: z
    .string()
    .max(280, 'Bio must be 280 characters or less')
    .optional(),
});

type ProfileFormData = z.infer<typeof profileFormSchema>;

/**
 * ProfileForm component provides a form for editing profile bio.
 * Uses React Hook Form with Zod validation and includes character count.
 *
 * @param initialBio - Initial bio value to populate the form
 * @param onSubmit - Callback when form is successfully submitted
 * @param onCancel - Callback when user cancels editing
 * @param isSubmitting - Whether the form is currently submitting
 * @param className - Additional CSS classes
 */
export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialBio = '',
  onSubmit,
  onCancel,
  isSubmitting = false,
  className = '',
}) => {
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      bio: initialBio,
    },
  });

  // Watch bio field for character count
  const bioValue = watch('bio', initialBio);
  const characterCount = bioValue?.length || 0;
  const maxCharacters = 280;

  const handleFormSubmit = async (data: ProfileFormData) => {
    try {
      // Trim whitespace from bio
      const trimmedBio = data.bio?.trim();

      await onSubmit({
        bio: trimmedBio || '',
      });

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      // Could show a confirmation dialog here, but for now just cancel
      onCancel();
    } else {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <Textarea
          id="bio"
          placeholder="Tell others about yourself..."
          className="min-h-[100px] resize-none"
          {...register('bio')}
          disabled={isSubmitting}
        />
        <div className="flex justify-between items-center">
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio.message}</p>
          )}
          <p className={`text-sm ml-auto ${characterCount > maxCharacters ? 'text-destructive' : 'text-muted-foreground'}`}>
            {characterCount}/{maxCharacters}
          </p>
        </div>
      </div>

      <div className="flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || characterCount > maxCharacters}
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
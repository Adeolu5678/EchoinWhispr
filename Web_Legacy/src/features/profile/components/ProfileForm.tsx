'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ProfileFormProps, ProfileFormData } from '../types';
import { useToast } from '@/hooks/use-toast';

// Validation schema for profile form
const profileFormSchema = z.object({
  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be 50 characters or less'),
  bio: z
    .string()
    .max(280, 'Bio must be 280 characters or less')
    .default(''),
  career: z
    .string()
    .max(100, 'Career must be 100 characters or less')
    .default(''),
  interests: z
    .string()
    .max(500, 'Interests must be 500 characters or less')
    .default(''),
  mood: z
    .string()
    .max(50, 'Mood must be 50 characters or less')
    .default(''),
});

/**
 * ProfileForm component provides a form for editing profile bio.
 * Uses React Hook Form with Zod validation and includes character count.
 *
 * @param initialBio - Initial bio value to populate the form
 * @param initialCareer - Initial career value
 * @param initialInterests - Initial interests value
 * @param initialMood - Initial mood value
 * @param initialDisplayName - Initial display name
 * @param onSubmit - Callback when form is successfully submitted
 * @param onCancel - Callback when user cancels editing
 * @param isSubmitting - Whether the form is currently submitting
 * @param className - Additional CSS classes
 */
export const ProfileForm: React.FC<ProfileFormProps> = ({
  initialBio = '',
  initialCareer = '',
  initialInterests = [],
  initialMood = '',
  initialDisplayName = '',
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
      displayName: initialDisplayName,
      bio: initialBio,
      career: initialCareer,
      interests: initialInterests.join(', '),
      mood: initialMood,
    },
  });

  // Watch bio field for character count
  const bioValue = watch('bio');
  const characterCount = bioValue?.length || 0;
  const maxCharacters = 280;

  const handleFormSubmit = async (data: ProfileFormData) => {
    try {
      await onSubmit({
        displayName: data.displayName.trim(),
        bio: data.bio?.trim() || '',
        career: data.career?.trim() || '',
        interests: data.interests?.trim() || '',
        mood: data.mood?.trim() || '',
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
        <label htmlFor="displayName" className="text-sm font-medium">
          Display Name
        </label>
        <Input
          id="displayName"
          placeholder="Your display name"
          {...register('displayName')}
          disabled={isSubmitting}
        />
        {errors.displayName && (
          <p className="text-sm text-destructive">{errors.displayName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="career" className="text-sm font-medium">
          Career / Profession
        </label>
        <Input
          id="career"
          placeholder="e.g. Software Engineer, Artist, Student"
          {...register('career')}
          disabled={isSubmitting}
        />
        {errors.career && (
          <p className="text-sm text-destructive">{errors.career.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="interests" className="text-sm font-medium">
          Interests (comma separated)
        </label>
        <Input
          id="interests"
          placeholder="e.g. Coding, Hiking, Sci-Fi"
          {...register('interests')}
          disabled={isSubmitting}
        />
        {errors.interests && (
          <p className="text-sm text-destructive">{errors.interests.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="mood" className="text-sm font-medium">
          Current Mood
        </label>
        <Input
          id="mood"
          placeholder="e.g. Focused, Creative, Chill"
          {...register('mood')}
          disabled={isSubmitting}
        />
        {errors.mood && (
          <p className="text-sm text-destructive">{errors.mood.message}</p>
        )}
      </div>

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
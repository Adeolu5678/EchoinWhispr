'use client';

import React, { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { Profile } from '../types';
import { useUploadProfilePicture } from '../hooks/useUploadProfilePicture';
import { useFeatureFlag } from '@/hooks/useFeatureFlags';

/**
 * ProfileAvatar component displays the user's profile picture or initials.
 * Supports profile picture upload when the PROFILE_PICTURES feature flag is enabled.
 *
 * @param profile - The user's profile data
 * @param displayName - User's display name from Clerk
 * @param username - User's username from Clerk
 */
interface ProfileAvatarProps {
  profile: Profile | null;
  displayName?: string;
  username?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({ profile, displayName, username }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProfilePicture, isUploading } = useUploadProfilePicture();
  const isProfilePicturesEnabled = useFeatureFlag('PROFILE_PICTURES');

  // Generate initials from displayName or username
  const getInitials = (displayName?: string, username?: string): string => {
    // Try displayName first, then username
    const name = displayName || username || '';

    // Split by spaces and take first letter of each word, up to 2 characters
    const initials = name
      .split(' ')
      .map((word: string) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');

    return initials || '?';
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadProfilePicture(file);
      } catch (error) {
        // Error handling is done in the hook
        console.error('Failed to upload profile picture:', error);
      }
    }
    // Reset input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={profile?.avatarUrl || undefined}
            alt={`${displayName || username || 'User'}'s avatar`}
          />
          <AvatarFallback className="text-lg font-semibold">
            {getInitials(displayName, username)}
          </AvatarFallback>
        </Avatar>

        {/* Upload overlay when feature is enabled */}
        {isProfilePicturesEnabled && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
            onClick={handleUploadClick}
            disabled={isUploading}
            aria-label="Upload profile picture"
          >
            {isUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-primary" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Hidden file input */}
      {isProfilePicturesEnabled && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Select profile picture"
        />
      )}

      {/* Status text */}
      {isProfilePicturesEnabled ? (
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          {isUploading ? 'Uploading...' : 'Click the camera icon to upload a profile picture'}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Profile pictures coming soon
        </p>
      )}
    </div>
  );
};
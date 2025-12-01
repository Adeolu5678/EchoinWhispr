import React from 'react';
import { ProfileBioProps } from '../types';

/**
 * ProfileBio component displays the user's biography in read-only mode.
 * Shows placeholder text when no bio exists.
 *
 * @param bio - The user's biography text (optional)
 * @param className - Additional CSS classes
 */
export const ProfileBio: React.FC<ProfileBioProps> = ({ bio, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground">Bio</h3>
      <div className="min-h-[60px] p-3 bg-muted/50 rounded-md border">
        {bio ? (
          <p className="text-sm text-foreground whitespace-pre-wrap">{bio}</p>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No bio added yet. Add a bio to tell others about yourself.
          </p>
        )}
      </div>
    </div>
  );
};
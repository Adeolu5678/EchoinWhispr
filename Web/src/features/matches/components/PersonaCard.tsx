'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Zap } from 'lucide-react';

interface PersonaCardProps {
  user: {
    id: string;
    username: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    skills?: string[];
    interests?: string[];
    humor?: string;
    career?: string;
    expertise?: string;
  };
  className?: string;
}

/**
 * PersonaCard component displays user personas in romantic context.
 * Focuses on skills, interests, and humor over photos for romantic connections.
 *
 * @param user - User data with persona information
 * @param className - Additional CSS classes
 */
export const PersonaCard: React.FC<PersonaCardProps> = ({
  user,
  className = '',
}) => {
  const displayName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.username;

  return (
    <Card className={`w-full max-w-sm mx-auto ${className}`}>
      <CardContent className="p-6">
        {/* Avatar placeholder */}
        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>

        {/* Name and username */}
        <div className="text-center mb-4">
          <h3 className="text-xl font-semibold text-primary-text">{displayName}</h3>
          <p className="text-sm text-secondary-text">@{user.username}</p>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-sm text-center mb-4 text-secondary-text">
            {user.bio}
          </p>
        )}

        {/* Career/Expertise */}
        {(user.career || user.expertise) && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-primary-text">Professional</span>
            </div>
            <div className="space-y-1">
              {user.career && (
                <Badge variant="secondary" className="text-xs">
                  {user.career}
                </Badge>
              )}
              {user.expertise && (
                <Badge variant="secondary" className="text-xs ml-1">
                  {user.expertise}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-primary-text">Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{user.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm font-medium text-primary-text">Interests</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {user.interests.slice(0, 4).map((interest, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
              {user.interests.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{user.interests.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Humor */}
        {user.humor && (
          <div className="text-center">
            <p className="text-sm italic text-secondary-text">
              &ldquo;{user.humor}&rdquo;
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
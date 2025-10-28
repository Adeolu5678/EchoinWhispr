'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { FEATURE_FLAGS } from '../../../config/featureFlags';
import { DecentralizedIdentity } from './DecentralizedIdentity';

/**
 * PersonaProfileScreen component provides a placeholder UI for persona profiles with verification.
 *
 * This component displays disabled form fields for career, skills, and expertise,
 * along with a placeholder verification badge. All fields are disabled as the feature
 * is currently in foundation phase.
 */
export const PersonaProfileScreen: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            Persona Profile
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Coming Soon
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Career Field */}
          <div className="space-y-2">
            <Label htmlFor="career">Career</Label>
            <Input
              id="career"
              placeholder="e.g., Software Engineer, Product Manager"
              disabled
              value=""
            />
          </div>

          {/* Skills Field */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Textarea
              id="skills"
              placeholder="e.g., JavaScript, React, Node.js, Python"
              disabled
              value=""
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              Enter skills separated by commas
            </p>
          </div>

          {/* Expertise Field */}
          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise</Label>
            <Textarea
              id="expertise"
              placeholder="Describe your professional expertise and experience"
              disabled
              value=""
              rows={4}
            />
          </div>

          {/* Interests Field - Deferred Feature: INTEREST_BASED_ANONYMOUS_MATCHING */}
          <div className="space-y-2">
            <Label htmlFor="interests">Interests</Label>
            <Textarea
              id="interests"
              placeholder="e.g., Technology, Music, Travel, Sports"
              disabled
              value=""
              rows={3}
            />
            <p className="text-sm text-muted-foreground">
              Enter interests separated by commas
            </p>
          </div>

          {/* Match Interests Section Placeholder */}
          <div className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center space-y-2">
              <Shield className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Match Interests
              </p>
              <p className="text-xs text-muted-foreground">
                Interest-based anonymous matching coming soon
              </p>
            </div>
          </div>

          {/* Verification Badge Placeholder */}
          <div className="flex items-center justify-center p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg">
            <div className="text-center space-y-2">
              <Shield className="w-8 h-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Verification Badge
              </p>
              <p className="text-xs text-muted-foreground">
                Hedera attestation integration coming soon
              </p>
            </div>
          </div>

          {/* Decentralized Identity Section - Conditional Rendering */}
          {FEATURE_FLAGS.HEDERA_BASED_DECENTRALIZED_IDENTITY_VERIFICATION && (
            <DecentralizedIdentity />
          )}
        </CardContent>
      </Card>
    </div>
  );
};
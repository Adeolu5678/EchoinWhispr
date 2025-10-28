'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useToast } from '@/hooks/use-toast';
import { Mood } from '@/features/profile/types';

const MOOD_OPTIONS = [
  { value: Mood.HAPPY, label: 'Happy', emoji: '😊' },
  { value: Mood.SAD, label: 'Sad', emoji: '😢' },
  { value: Mood.EXCITED, label: 'Excited', emoji: '🤩' },
  { value: Mood.CALM, label: 'Calm', emoji: '😌' },
  { value: Mood.ANGRY, label: 'Angry', emoji: '😠' },
  { value: Mood.RELAXED, label: 'Relaxed', emoji: '😎' },
  { value: Mood.ENERGETIC, label: 'Energetic', emoji: '⚡' },
  { value: Mood.TIRED, label: 'Tired', emoji: '😴' },
] as const;

type MoodValue = Mood;

interface MoodSelectorProps {
  currentMood?: Mood;
  onMoodSelect: (mood: Mood) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * MoodSelector component allows users to select their current mood for mood-based connections.
 * This is a foundation component for the MOOD_BASED_CONNECTIONS feature.
 *
 * @param currentMood - Currently selected mood
 * @param onMoodSelect - Callback when mood is selected
 * @param isLoading - Whether the component is in loading state
 * @param className - Additional CSS classes
 */
export const MoodSelector: React.FC<MoodSelectorProps> = ({
  currentMood,
  onMoodSelect,
  isLoading = false,
  className = '',
}) => {
  const { toast } = useToast();

  const handleMoodSelect = async (mood: MoodValue) => {
    if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
      toast({
        title: 'Feature not available',
        description: 'Mood-based connections are not yet available.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onMoodSelect(mood);
      toast({
        title: 'Mood updated',
        description: `You're feeling ${mood} today!`,
      });
    } catch (error) {
      console.error('Failed to update mood:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your mood. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!FEATURE_FLAGS.MOOD_BASED_CONNECTIONS) {
    return (
      <Card className={`opacity-50 ${className}`}>
        <CardHeader>
          <CardTitle className="text-lg">Current Mood</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Mood-based connections coming soon! This feature will allow you to connect with others feeling the same way.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">How are you feeling today?</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select your mood to find connections with others feeling the same way.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {MOOD_OPTIONS.map((mood) => (
            <Button
              key={mood.value}
              variant={currentMood === mood.value ? 'default' : 'outline'}
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={() => handleMoodSelect(mood.value)}
              disabled={isLoading}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-sm font-medium">{mood.label}</span>
            </Button>
          ))}
        </div>
        {currentMood && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-center">
              Current mood: <span className="font-medium capitalize">{currentMood}</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
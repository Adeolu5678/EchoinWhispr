'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAIHeadingGenerator } from '../hooks/useAIHeadingGenerator';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useToast } from '@/hooks/use-toast';
import { Id } from '@/lib/convex';

interface AIHeadingGeneratorProps {
  whisperId: Id<'whispers'>;
  whisperContent: string;
  currentHeading?: string;
  onHeadingGenerated?: (heading: string) => void;
  className?: string;
}

/**
 * AIHeadingGenerator component for generating AI-powered headings for whispers
 * Provides a placeholder UI with disabled generation button when feature is disabled
 *
 * @param whisperId - The ID of the whisper to generate heading for
 * @param whisperContent - The content of the whisper
 * @param currentHeading - Optional existing heading
 * @param onHeadingGenerated - Callback when heading is generated
 * @param className - Additional CSS classes
 */
export const AIHeadingGenerator: React.FC<AIHeadingGeneratorProps> = ({
  whisperId,
  whisperContent,
  currentHeading,
  onHeadingGenerated,
  className = '',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateHeading, isLoading } = useAIHeadingGenerator();
  const { toast } = useToast();

  /**
   * Handles heading generation
   */
  const handleGenerateHeading = async () => {
    if (!FEATURE_FLAGS.AI_GENERATED_WHISPER_HEADINGS) {
      return; // Feature disabled
    }

    setIsGenerating(true);
    try {
      const heading = await generateHeading(whisperId, whisperContent);
      if (!heading || typeof heading !== 'string' || heading.trim() === '') {
        toast({ title: 'Error', description: 'Invalid heading generated', variant: 'destructive' });
        return;
      }
      onHeadingGenerated?.(heading.trim());
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to generate heading', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Don't render if feature is disabled and no heading exists
  if (!FEATURE_FLAGS.AI_GENERATED_WHISPER_HEADINGS && !currentHeading) {
    return null;
  }

  return (
    <Card className={`border-dashed border-muted-foreground/20 ${className}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              AI Heading
            </span>
            {currentHeading && (
              <Badge variant="secondary" className="text-xs">
                Generated
              </Badge>
            )}
          </div>

          {FEATURE_FLAGS.AI_GENERATED_WHISPER_HEADINGS ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateHeading}
              disabled={isLoading || isGenerating}
              className="h-7 px-2 text-xs"
            >
              {isLoading || isGenerating ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 mr-1" />
                  Generate
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="h-7 px-2 text-xs opacity-50 cursor-not-allowed"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Coming Soon
            </Button>
          )}
        </div>

        {currentHeading && (
          <div className="mt-2">
            <p className="text-sm font-semibold text-foreground">
              {currentHeading}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

AIHeadingGenerator.displayName = 'AIHeadingGenerator';
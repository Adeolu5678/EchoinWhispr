'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  HeartHandshake, 
  Heart, 
  Briefcase,
  MessageSquare,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export function ResonanceMatchWidget() {
  const { toast } = useToast();
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    matchId: string;
    score: number;
    matchReasons: string[];
    matchMood?: string;
    matchLifePhase?: string;
    sharedInterests: string[];
  } | null>(null);

  const findMatch = useMutation(api.resonance.findResonanceMatch);
  const preferences = useQuery(api.resonance.getResonancePreferences);

  const handleFindMatch = async () => {
    setIsMatching(true);
    try {
      const result = await findMatch();
      if (result) {
        setMatchResult(result);
        toast({
          title: "Resonance Match Found! 🎵",
          description: result.matchReasons[0] || "Found someone on your wavelength!",
        });
      } else {
        toast({
          title: "No matches right now",
          description: "Try again later or update your preferences.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Match error:', error);
      toast({
        title: "Match failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <Card className="glass border-white/10 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <HeartHandshake className="w-5 h-5 text-accent" />
          <span className="font-medium">Resonance Match</span>
        </div>

        {!matchResult ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">
              Find someone who matches your mood, life phase, and vibe.
            </p>

            {preferences && (
              <div className="flex flex-wrap gap-2 mb-4">
                {preferences.preferSimilarMood && (
                  <Badge variant="secondary" className="text-xs">Similar Mood</Badge>
                )}
                {preferences.preferComplementaryMood && (
                  <Badge variant="secondary" className="text-xs">Complementary Vibes</Badge>
                )}
                {preferences.matchLifePhase && (
                  <Badge variant="secondary" className="text-xs">Same Life Phase</Badge>
                )}
                {preferences.preferMentor && (
                  <Badge variant="secondary" className="text-xs">Seeking Mentor</Badge>
                )}
              </div>
            )}

            <Button 
              onClick={handleFindMatch}
              disabled={isMatching}
              className="w-full bg-gradient-to-r from-accent to-primary hover:from-fuchsia-600 hover:to-primary"
            >
              {isMatching ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Finding...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Find Resonance
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-5 h-5 text-accent animate-pulse" />
              <span className="text-lg font-semibold">Match Found!</span>
            </div>

            <div className="bg-white/5 rounded-lg p-3 space-y-2">
              {matchResult.matchReasons.map((reason, i) => (
                <Badge key={i} variant="secondary" className="mr-1">
                  {reason}
                </Badge>
              ))}
            </div>

            {matchResult.matchMood && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>Feeling: {matchResult.matchMood}</span>
              </div>
            )}

            {matchResult.matchLifePhase && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <span>{matchResult.matchLifePhase}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Link href={`/compose?to=${matchResult.matchId}`} className="flex-1">
                <Button className="w-full">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              </Link>
              <Button 
                variant="outline"
                onClick={() => {
                  setMatchResult(null);
                  handleFindMatch();
                }}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

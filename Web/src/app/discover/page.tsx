'use client';

import { useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, 
  Users, 
  RefreshCw, 
  MessageSquare, 
  Heart,
  Briefcase,
  Target,
  Zap,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function DiscoverPage() {
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [matchResult, setMatchResult] = useState<{
    matchId: string;
    score: number;
    sharedInterests: string[];
    matchCareer?: string;
    matchMood?: string;
  } | null>(null);

  const findMatch = useMutation(api.matchmaking.findRandomMatch);
  const matchStats = useQuery(api.matchmaking.getMatchStats);
  const recentMatches = useQuery(api.matchmaking.getRecentMatches, { limit: 5 });

  const handleFindMatch = async () => {
    setIsSearching(true);
    try {
      const result = await findMatch();
      if (result) {
        setMatchResult(result);
        toast({
          title: "Match Found! 🎉",
          description: `Found someone with ${result.sharedInterests.length} shared interests!`,
        });
      } else {
        toast({
          title: "No matches available",
          description: "Try again later or update your interests!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Match error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="glass p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-3 rounded-xl">
              <Sparkles className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gradient">
                Discover
              </h1>
              <p className="text-muted-foreground">
                Find people who share your interests
              </p>
            </div>
          </div>
          
          {/* Stats Row */}
          {matchStats && (
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {matchStats.totalMatches}
                </div>
                <div className="text-xs text-muted-foreground">Total Matches</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-400">
                  {matchStats.weeklyMatches}
                </div>
                <div className="text-xs text-muted-foreground">This Week</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-amber-400">
                  {matchStats.avgScore}
                </div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
            </div>
          )}
        </header>

        {/* Main Match Card */}
        <Card className="glass border-white/10 p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5" />
          
          <div className="relative z-10">
            {!matchResult ? (
              <>
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                  <Users className="w-12 h-12 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Find Someone Like You</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Our algorithm matches you based on shared interests, career, and mood. 
                  Connect with someone who truly gets you!
                </p>
                <Button 
                  size="lg"
                  onClick={handleFindMatch}
                  disabled={isSearching}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-xl"
                >
                  {isSearching ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Finding Match...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Find My Match
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center animate-pulse">
                  <Heart className="w-10 h-10 text-green-400" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold mb-2">Match Found! 🎉</h2>
                  <p className="text-muted-foreground">
                    Compatibility Score: <span className="text-green-400 font-bold">{matchResult.score}</span>
                  </p>
                </div>

                {matchResult.matchCareer && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    <span>{matchResult.matchCareer}</span>
                  </div>
                )}

                {matchResult.sharedInterests.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Shared Interests:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {matchResult.sharedInterests.map((interest, i) => (
                        <Badge 
                          key={i} 
                          variant="secondary" 
                          className="bg-purple-500/20 text-purple-300"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 justify-center pt-4">
                  <Link href={`/compose?to=${matchResult.matchId}`}>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Whisper
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setMatchResult(null);
                      handleFindMatch();
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Find Another
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Top Interests */}
        {matchStats?.topInterests && matchStats.topInterests.length > 0 && (
          <Card className="glass border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold">Your Top Matching Interests</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchStats.topInterests.map((interest, i) => (
                <Badge 
                  key={i}
                  className="bg-amber-500/20 text-amber-300 border-amber-500/30"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </Card>
        )}

        {/* Recent Matches */}
        {recentMatches && recentMatches.length > 0 && (
          <Card className="glass border-white/10 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3 className="font-semibold">Recent Matches</h3>
            </div>
            <div className="space-y-3">
              {recentMatches.map((match, i) => (
                <div 
                  key={i}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Score: {match.score}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {match.sharedInterests?.length || 0} shared interests
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(match.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

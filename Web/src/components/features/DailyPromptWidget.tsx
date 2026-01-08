'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Check, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export function DailyPromptWidget() {
  const [isResponding, setIsResponding] = useState(false);
  
  const todaysPrompt = useQuery(api.dailyPrompts.getTodaysPrompt);
  const hasResponded = useQuery(api.dailyPrompts.hasRespondedToday);
  const markResponded = useMutation(api.dailyPrompts.markPromptResponded);

  const handleRespond = async () => {
    if (!todaysPrompt) return;
    setIsResponding(true);
    try {
      await markResponded({ promptId: todaysPrompt._id });
    } finally {
      setIsResponding(false);
    }
  };

  if (!todaysPrompt) {
    return null;
  }

  return (
    <Card className="glass border-white/10 p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">Whisper of the Day</span>
          </div>
          <Badge className="bg-amber-500/20 text-amber-300 capitalize">
            {todaysPrompt.category}
          </Badge>
        </div>

        <p className="text-lg font-medium mb-4">
          &quot;{todaysPrompt.content}&quot;
        </p>

        {hasResponded ? (
          <div className="flex items-center gap-2 text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">You&apos;ve reflected on this today!</span>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link href="/compose" className="flex-1">
              <Button 
                variant="outline" 
                className="w-full"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Share with Someone
              </Button>
            </Link>
            <Button 
              onClick={handleRespond}
              disabled={isResponding}
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            >
              {isResponding ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

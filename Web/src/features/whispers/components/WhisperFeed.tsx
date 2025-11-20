import React from 'react';
import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';
import { WhisperList } from './WhisperList';
import { Button } from '@/components/ui/button';

export const WhisperFeed: React.FC = () => {
  return (
    <div className="min-h-screen pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
      <div className="w-full max-w-4xl">
        <header className="flex items-center justify-between mb-8 glass p-6 rounded-2xl border border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2.5 rounded-xl">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Whisper Feed</h2>
              <p className="text-muted-foreground text-sm">Listen to the echoes of the void</p>
            </div>
          </div>
          <Link href="/compose">
            <Button className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Whisper</span>
            </Button>
          </Link>
        </header>
        
        <main className="space-y-6">
          <div className="glass rounded-2xl border border-white/10 overflow-hidden p-1">
            <div className="bg-card/50 backdrop-blur-sm rounded-xl">
              <WhisperList showMarkAsRead />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
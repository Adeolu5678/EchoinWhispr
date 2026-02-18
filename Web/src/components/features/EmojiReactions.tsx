'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import type { Id } from '@/lib/convex';

const EMOJI_OPTIONS = ['❤️', '😂', '😮', '😢', '🔥', '👍', '👎', '🙏'];

interface EmojiReactionsProps {
  whisperId: Id<'whispers'>;
  reactions?: Array<{ userId: Id<'users'>; emoji: string; createdAt: number }>;
  currentUserId?: Id<'users'>;
}

export function EmojiReactions({ whisperId, reactions = [], currentUserId }: EmojiReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const toggleReaction = useMutation(api.whispers.toggleReaction);

  const handleReact = async (emoji: string) => {
    try {
      await toggleReaction({ whisperId, emoji });
    } catch (error) {
      console.error('Reaction error:', error);
    }
    setShowPicker(false);
  };

  // Group reactions by emoji
  const grouped: Record<string, { count: number; userReacted: boolean }> = {};
  reactions.forEach(r => {
    if (!grouped[r.emoji]) {
      grouped[r.emoji] = { count: 0, userReacted: false };
    }
    grouped[r.emoji].count++;
    if (r.userId === currentUserId) {
      grouped[r.emoji].userReacted = true;
    }
  });

  return (
    <div className="flex flex-wrap items-center gap-1">
      {/* Existing reactions */}
      {Object.entries(grouped).map(([emoji, { count, userReacted }]) => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji)}
          aria-label={`React with ${emoji}${userReacted ? ' (selected)' : ''}`}
          aria-pressed={userReacted}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
            userReacted 
              ? 'bg-primary/20 border border-primary/40' 
              : 'bg-white/5 hover:bg-white/10'
          }`}
        >
          <span>{emoji}</span>
          {count > 1 && <span className="text-muted-foreground">{count}</span>}
        </button>
      ))}

      {/* Add reaction button */}
      <div className="relative">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => setShowPicker(!showPicker)}
          aria-label="Add reaction"
          aria-expanded={showPicker}
          aria-haspopup="dialog"
        >
          <Smile className="w-3 h-3" />
        </Button>

        {showPicker && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowPicker(false)}
            />
            <div className="absolute bottom-full left-0 mb-1 z-50 bg-card border border-white/10 rounded-lg p-2 shadow-xl">
              <div className="flex gap-1">
                {EMOJI_OPTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    aria-label={`React with ${emoji}`}
                    className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

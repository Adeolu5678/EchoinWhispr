'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

interface TypingIndicatorProps {
  conversationId: Id<'conversations'>;
}

export function TypingIndicator({ conversationId }: TypingIndicatorProps) {
  const typingStatus = useQuery(api.whispers.getTypingStatus, { conversationId });

  if (!typingStatus?.isTyping) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground px-4 py-2">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span>Someone is typing...</span>
    </div>
  );
}

interface UseTypingIndicatorOptions {
  otherUserId: Id<'users'>;
  debounceMs?: number;
}

export function useTypingIndicator({ otherUserId, debounceMs = 2000 }: UseTypingIndicatorOptions) {
  const setTyping = useMutation(api.whispers.setTypingStatus);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSentRef = useRef<number>(0);

  const sendTypingIndicator = useCallback(() => {
    const now = Date.now();
    // Only send every 2 seconds at most
    if (now - lastSentRef.current > debounceMs) {
      lastSentRef.current = now;
      setTyping({ otherUserId }).catch(console.error);
    }

    // Reset the timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      // Could send a "stopped typing" event here if needed
    }, debounceMs);
  }, [otherUserId, debounceMs, setTyping]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { sendTypingIndicator };
}

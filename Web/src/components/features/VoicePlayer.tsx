'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import type { Id } from '@/lib/convex';

interface VoicePlayerProps {
  storageId: Id<'_storage'>;
  whisperId: Id<'whispers'>;
  duration: number;
}

export function VoicePlayer({ storageId, whisperId, duration }: VoicePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioUrl = useQuery(api.whispers.getVoiceMessageUrl, { storageId, whisperId });

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('Playback failed:', error);
          setIsPlaying(false);
        });
    }
  };

  const formatDuration = (seconds: number) => {
    const totalSecs = Math.round(seconds);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!audioUrl) {
    return (
      <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl">
        <Volume2 className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl">
      <audio ref={audioRef} src={audioUrl} hidden />

      <Button
        size="icon"
        variant="secondary"
        className="h-10 w-10 rounded-full"
        onClick={togglePlayback}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4 ml-0.5" />
        )}
      </Button>

      <div className="flex-1 space-y-1">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>🎤 Voice Message</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, Square, Send, Play, Pause, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  recipientUsername: string;
  onSent?: () => void;
}

export function VoiceRecorder({ recipientUsername, onSent }: VoiceRecorderProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSending, setIsSending] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateUploadUrl = useMutation(api.whispers.generateVoiceUploadUrl);
  const sendVoiceWhisper = useMutation(api.whispers.sendVoiceWhisper);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      // Duration timer
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record voice messages.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const discardRecording = () => {
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const sendRecording = async () => {
    if (!audioBlob) return;

    setIsSending(true);
    try {
      // Get upload URL
      const uploadUrl = await generateUploadUrl();

      // Upload the audio
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': audioBlob.type },
        body: audioBlob,
      });
      
      const { storageId } = await response.json();

      // Send the voice whisper
      await sendVoiceWhisper({
        recipientUsername,
        audioStorageId: storageId,
        audioDuration: duration,
      });

      toast({
        title: "Voice whisper sent! 🎤",
        description: `${duration}s voice message delivered.`,
      });

      discardRecording();
      onSent?.();
    } catch (error) {
      console.error('Send error:', error);
      toast({
        title: "Failed to send",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-white/5 rounded-xl">
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)}
          hidden
        />
      )}

      {!audioBlob ? (
        <>
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            onClick={isRecording ? stopRecording : startRecording}
            className={isRecording ? "animate-pulse" : ""}
          >
            {isRecording ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>

          {isRecording && (
            <Badge variant="destructive" className="font-mono">
              🔴 {formatDuration(duration)}
            </Badge>
          )}

          {!isRecording && (
            <span className="text-xs text-muted-foreground">
              Tap to record voice message
            </span>
          )}
        </>
      ) : (
        <>
          <Button
            size="icon"
            variant="secondary"
            onClick={togglePlayback}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>

          <Badge variant="secondary" className="font-mono">
            {formatDuration(duration)}
          </Badge>

          <div className="flex-1" />

          <Button
            size="icon"
            variant="ghost"
            onClick={discardRecording}
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <Button
            size="icon"
            onClick={sendRecording}
            disabled={isSending}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </>
      )}
    </div>
  );
}

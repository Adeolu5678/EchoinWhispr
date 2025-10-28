import React, { useState, useCallback, useRef, useMemo } from 'react';
import { WHISPER_LIMITS } from '../../whispers/types';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useFileUpload } from '@/hooks/useFileUpload';
import { validateFile } from '@/lib/fileValidation';
import { useToast } from '@/hooks/use-toast';
import { useFriendWhispering } from '../hooks/useFriendWhispering';
import { Shield } from 'lucide-react';

interface FriendWhisperComposerProps {
  onWhisperSent?: () => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
  friendUsername: string;
}

export const FriendWhisperComposer: React.FC<FriendWhisperComposerProps> = ({
  onWhisperSent,
  placeholder = 'Type your friend whisper here.',
  maxLength = WHISPER_LIMITS.MAX_CONTENT_LENGTH,
  className = '',
  friendUsername,
}) => {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { upload, isUploading } = useFileUpload();
  const { toast } = useToast();
  const { sendFriendWhisper, isLoading } = useFriendWhispering();

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newContent = e.target.value;
      if (newContent.length <= maxLength) {
        setContent(newContent);
      }
    },
    [maxLength]
  );

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const validation = await validateFile(file);
      if (!validation.isValid) {
        toast({ title: 'Invalid file', description: validation.error, variant: 'destructive' });
        return;
      }
      setSelectedImage(file);
    } catch (error) {
      console.error('File validation error:', error);
      toast({ title: 'Error', description: 'Failed to validate file', variant: 'destructive' });
    }
  }, [toast]);

  const handleImageButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedContent = content.trim();
      if (!trimmedContent || trimmedContent.length < WHISPER_LIMITS.MIN_CONTENT_LENGTH) {
        return;
      }

      try {
        let imageUrl: string | undefined;
        if (selectedImage) {
          const uploadResult = await upload(selectedImage);
          imageUrl = uploadResult.url;
        }

        await sendFriendWhisper({
          recipientUsername: friendUsername,
          content: trimmedContent,
          imageUrl,
        });

        setContent('');
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onWhisperSent?.();
      } catch (error) {
        console.error('Failed to send friend whisper:', error);
        toast({ title: 'Error', description: 'Failed to send friend whisper', variant: 'destructive' });
      }
    },
    [content, selectedImage, friendUsername, upload, onWhisperSent, toast, sendFriendWhisper]
  );

  const isDisabled = useMemo(() => {
    const hasValidContent = content.trim().length >= WHISPER_LIMITS.MIN_CONTENT_LENGTH;
    const withinLimit = content.length <= maxLength;
    return !hasValidContent || !withinLimit || isLoading || isUploading;
  }, [content, maxLength, isLoading, isUploading]);

  if (!FEATURE_FLAGS.ENHANCED_FRIEND_WHISPERING) {
    return null;
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="bg-background-light dark:bg-card-dark flex flex-col items-stretch rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            <p className="text-gray-800 dark:text-white text-lg font-bold leading-normal">
              Whisper to {friendUsername}
            </p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <textarea
                id="friend-whisper-textarea"
                placeholder={placeholder}
                value={content}
                onChange={handleContentChange}
                maxLength={maxLength}
                className="w-full min-h-[120px] resize-none p-3 pr-12 rounded-lg bg-gray-200 dark:bg-border-dark text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              {FEATURE_FLAGS.IMAGE_UPLOADS && (
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-1 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  onClick={handleImageButtonClick}
                >
                  <span className="material-symbols-outlined text-base text-gray-700 dark:text-gray-300">image</span>
                </button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-700 dark:text-gray-300">
                {content.length}/{maxLength}
              </span>
              <button
                onClick={handleSubmit}
                disabled={isDisabled}
                className="flex min-w-[120px] items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] disabled:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || isUploading ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Whisper</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
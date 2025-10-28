import React, { useState, useCallback, useRef, useMemo } from 'react';
import { useSendWhisper } from '../hooks/useWhispers';
import { useRandomMessaging } from '../hooks/useRandomMessaging';
import { WHISPER_LIMITS } from '../types';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useFileUpload } from '@/hooks/useFileUpload';
import { validateFile } from '@/lib/fileValidation';
import { useToast } from '@/hooks/use-toast';
import { RecipientSelector } from './RecipientSelector';
import { RandomMessaging } from './RandomMessaging';
import { UserSearchResult } from '@/features/users/types';
import { Shield } from 'lucide-react';

interface WhisperComposerProps {
  onWhisperSent?: () => void;
  placeholder?: string;
  maxLength?: number;
  className?: string;
}

export const WhisperComposer: React.FC<WhisperComposerProps> = ({
  onWhisperSent,
  placeholder = 'Type your whisper here.',
  maxLength = WHISPER_LIMITS.MAX_CONTENT_LENGTH,
  className = '',
}) => {
  const [content, setContent] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState<UserSearchResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isRandomMode, setIsRandomMode] = useState(false);
  const [isFriendWhisperMode, setIsFriendWhisperMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sendWhisper, isLoading } = useSendWhisper();
  const { sendRandomMessage, isLoading: isRandomLoading } = useRandomMessaging();
  const { upload, isUploading } = useFileUpload();
  const { toast } = useToast();

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
      if (!trimmedContent || trimmedContent.length < WHISPER_LIMITS.MIN_CONTENT_LENGTH || (!isRandomMode && !selectedRecipient)) {
        return;
      }

      try {
        let imageUrl: string | undefined;
        if (selectedImage) {
          const uploadResult = await upload(selectedImage);
          imageUrl = uploadResult.url;
        }

        if (isRandomMode) {
          // Send random message using real Hedera integration
          await sendRandomMessage(trimmedContent);
          toast({ title: 'Random message sent!', description: 'Your anonymous message has been sent to a random recipient.' });
        } else {
          await sendWhisper({
            recipientUsername: selectedRecipient!.username,
            content: trimmedContent,
            imageUrl,
          });
        }

        setContent('');
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onWhisperSent?.();
      } catch (error) {
        console.error('Failed to send whisper:', error);
      }
    },
    [content, selectedRecipient, isRandomMode, selectedImage, sendWhisper, sendRandomMessage, upload, onWhisperSent, toast]
  );

  const isDisabled = useMemo(() => {
    const hasValidContent = content.trim().length >= WHISPER_LIMITS.MIN_CONTENT_LENGTH;
    const hasRecipient = isRandomMode || !!selectedRecipient;
    const withinLimit = content.length <= maxLength;
    return !hasValidContent || !hasRecipient || !withinLimit || isLoading || isUploading || isRandomLoading;
  }, [content, selectedRecipient, isRandomMode, maxLength, isLoading, isUploading, isRandomLoading]);

  return (
    <div className={`p-4 ${className}`}>
        <div className="bg-background-light dark:bg-card-dark flex flex-col items-stretch rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    <p className="text-primary-text text-lg font-bold leading-normal">New Whisper</p>
                </div>
                <div className="space-y-4">
                  {FEATURE_FLAGS.RANDOM_ANONYMOUS_MESSAGING && (
                    <div className="flex items-center gap-4">
                      <label className="text-lg font-bold text-primary-text">Mode:</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsRandomMode(false)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            !isRandomMode
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Direct Message
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsRandomMode(true)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            isRandomMode
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Random Message
                        </button>
                      </div>
                    </div>
                  )}
                  {FEATURE_FLAGS.ENHANCED_FRIEND_WHISPERING && !isRandomMode && (
                    <div className="flex items-center gap-4">
                      <label className="text-lg font-bold text-primary-text">Friend Whisper:</label>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsFriendWhisperMode?.(false)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            !isFriendWhisperMode
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Regular Whisper
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsFriendWhisperMode?.(true)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                            isFriendWhisperMode
                              ? 'bg-primary text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          Friend Whisper
                        </button>
                      </div>
                    </div>
                  )}
                  {!isRandomMode && (
                    <div>
                      <label htmlFor="recipient-selector" className="text-lg font-bold text-primary-text">To:</label>
                      <RecipientSelector
                        selectedRecipient={selectedRecipient}
                        onRecipientSelect={setSelectedRecipient}
                      />
                    </div>
                  )}
                  {isRandomMode && FEATURE_FLAGS.RANDOM_ANONYMOUS_MESSAGING && (
                    <RandomMessaging />
                  )}
                  <div className="relative">
                    <textarea
                      id="whisper-textarea"
                      placeholder={placeholder}
                      value={content}
                      onChange={handleContentChange}
                      maxLength={maxLength}
                      className="w-full min-h-[120px] resize-none p-3 pr-12 rounded-lg bg-gray-200 dark:bg-border-dark text-primary-text focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-secondary-text"
                    ></textarea>
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
                    <span className="text-xs text-secondary-text">
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
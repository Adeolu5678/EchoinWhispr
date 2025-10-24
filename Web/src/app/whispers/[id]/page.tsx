'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { FEATURE_FLAGS } from '@/config/featureFlags';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { api } from '@/lib/convex';
import { useQuery, useMutation } from 'convex/react';
import { Id } from '@/lib/convex';
import { Shield, ArrowLeft, Copy, Save } from 'lucide-react';

/**
 * WhisperDetailPage component displays full whisper content with interaction options,
 * styled with a custom UI design.
 */
export default function WhisperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();

  const whisperId = (params.id as string) as Id<'whispers'>;

  // Fetch whisper data
  const whisper = useQuery(api.whispers.getWhisperById, { whisperId });

  // Reply functionality
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const echoWhisper = useMutation(api.conversations.echoWhisper);

  /**
   * Handles sending a reply that creates a conversation
   */
  const handleReply = async () => {
    if (!replyContent.trim() || !whisper) return;

    setIsReplying(true);
    try {
      await echoWhisper({
        whisperId: whisper._id as Id<'whispers'>,
        replyContent: replyContent.trim(),
      });

      toast({
        title: 'Echo request sent!',
        description: 'Your conversation has been started.',
      });

      router.push('/conversations');
    } catch (error) {
      console.error('Failed to echo whisper:', error);
      toast({
        title: 'Failed to send reply',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsReplying(false);
    }
  };

  /**
   * Copies the whisper content to the clipboard
   */
  const handleCopy = () => {
    if(!whisper) return;
    navigator.clipboard.writeText(whisper.content);
    toast({ title: 'Copied to clipboard!' });
  };

  const formattedTime = whisper
    ? formatDistanceToNow(new Date(whisper._creationTime), { addSuffix: true })
    : '';

  // The Convex backend already enforces that only recipients can access whispers
  const isRecipient: boolean = !!whisper;

  // Loading state skeleton matching the new design
  if (!whisper) {
    return (
      <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
        <div className="flex flex-col max-w-[960px] flex-1 animate-pulse">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark px-4 sm:px-10 py-3">
                <div className="flex items-center gap-4">
                    <div className="size-6 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="flex flex-1 justify-end gap-4 sm:gap-8">
                    <div className="h-10 w-12 bg-gray-300 dark:bg-border-dark rounded-lg"></div>
                    <div className="size-10 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                </div>
            </header>
            <main className="flex-1 mt-8">
                <div className="p-4">
                    <div className="bg-background-light dark:bg-card-dark rounded-xl shadow-lg">
                        <div className="p-6 flex flex-col gap-4">
                            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
                            <div className="h-5 w-full bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
                            <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-5 w-24 bg-gray-300 dark:bg-gray-700 rounded float-right mr-6 mb-3"></div>
                    </div>
                </div>
            </main>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-border-dark px-4 sm:px-10 py-3">
          <div className="flex items-center gap-4 text-gray-800 dark:text-white">
            <div className="size-6 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-gray-800 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">EchoinWhispr</h2>
          </div>
          <div className="flex flex-1 justify-end gap-4 sm:gap-8">
            <button
                onClick={() => router.back()}
                className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 bg-gray-200 dark:bg-border-dark text-gray-800 dark:text-white gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5"
            >
              <ArrowLeft className="w-6 h-6 text-gray-800 dark:text-white" />
            </button>
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
              style={{ backgroundImage: `url(${user?.imageUrl})` }}
            ></div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 mt-8">
          {/* Whisper Card */}
          <div className="p-4">
            <div className="bg-background-light dark:bg-card-dark flex flex-col items-stretch rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                  <p className="text-gray-800 dark:text-white text-lg font-bold leading-normal">Anonymous Whisper</p>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-base font-normal leading-relaxed">
                  {whisper.content}
                </p>
                {FEATURE_FLAGS.IMAGE_UPLOADS && whisper.imageUrl && (
                  <div className="mt-4">
                    <Image
                      alt="Whisper Image"
                      className="rounded-lg w-full h-auto object-cover"
                      src={whisper.imageUrl}
                      width={500}
                      height={400}
                    />
                  </div>
                )}
              </div>
              <p className="text-gray-500 dark:text-muted-dark text-sm font-normal leading-normal pb-3 pt-1 px-6 text-right">
                <time dateTime={new Date(whisper._creationTime).toISOString()}>
                  {formattedTime}
                </time>
              </p>
            </div>
          </div>

          {/* Action & Reply Section */}
          {isRecipient ? (
            <div className="px-4 py-6 border-t border-gray-200 dark:border-border-dark space-y-6">
                {/* Action Buttons */}
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex gap-2">
                        <button onClick={handleCopy} className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-border-dark px-4 py-2 text-gray-800 dark:text-white text-sm font-medium leading-normal">
                            <Copy className="w-4 h-4" />
                            <span>Copy</span>
                        </button>
                        <button onClick={() => toast({ title: "Feature coming soon!" })} className="flex items-center justify-center gap-2 rounded-lg bg-gray-200 dark:bg-border-dark px-4 py-2 text-gray-800 dark:text-white text-sm font-medium leading-normal">
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </button>
                    </div>
                </div>

                {/* Reply Composer */}
                <div className="space-y-4">
                    <label htmlFor="reply-textarea" className="text-lg font-bold text-gray-800 dark:text-white">Send Reply</label>
                    <div className="relative">
                        <textarea
                          id="reply-textarea"
                          placeholder="Type your reply here..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          maxLength={280}
                          className="w-full min-h-[100px] resize-none p-3 pr-12 rounded-lg bg-gray-200 dark:bg-border-dark text-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                        {FEATURE_FLAGS.IMAGE_UPLOADS && (
                          <button
                            type="button"
                            className="absolute bottom-3 right-3 p-1 rounded bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                            onClick={() => toast({ title: "Image upload coming soon!" })}
                          >
                            <span className="material-symbols-outlined text-base text-gray-700 dark:text-gray-300">image</span>
                          </button>
                        )}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-muted-dark">
                          {replyContent.length}/280
                        </span>
                        <button
                          onClick={handleReply}
                          disabled={!replyContent.trim() || isReplying}
                          className="flex min-w-[120px] items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] disabled:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isReplying ? (
                             <>
                                <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Sending...</span>
                            </>
                          ) : (
                            <span>Reply</span>
                          )}
                        </button>
                    </div>
                </div>
            </div>
          ) : (
            <div className="px-4 py-6 border-t border-gray-200 dark:border-border-dark">
                <div className="p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 flex items-center gap-3">
                    <Shield className="w-6 h-6" />
                    <p>You can only reply to whispers that were sent to you.</p>
                </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
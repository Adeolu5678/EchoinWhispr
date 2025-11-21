import { useMutation } from 'convex/react';
import { useState } from 'react';
import { api } from '@/lib/convex';


export const useSendMysteryWhisper = () => {
  const sendMysteryWhisperMutation = useMutation(api.mysteryWhispers.sendMysteryWhisper);
  const [isLoading, setIsLoading] = useState(false);


  const sendMysteryWhisper = async (args: { content: string; imageUrl?: string }) => {
    setIsLoading(true);
    try {
      await sendMysteryWhisperMutation(args);
      return { success: true };
    } catch (error) {
      console.error('Failed to send mystery whisper:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMysteryWhisper,
    isLoading,
  };
};

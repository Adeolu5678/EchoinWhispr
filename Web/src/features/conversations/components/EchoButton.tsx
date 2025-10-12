'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle, Loader2 } from 'lucide-react';
import { useSendEchoRequest } from '../hooks/useSendEchoRequest';
import type { GenericId } from 'convex/values';

/**
 * EchoButton component allows users to send an echo request for a whisper.
 * Only shown for whispers received by the current user.
 *
 * @param whisperId - The ID of the whisper to echo back
 * @param recipientId - The ID of the current user (recipient of the whisper)
 * @param onSuccess - Callback when echo request is sent successfully
 */
interface EchoButtonProps {
  whisperId: GenericId<'whispers'>;
  recipientId: string;
  onSuccess?: () => void;
}

export const EchoButton: React.FC<EchoButtonProps> = ({
  whisperId,
  recipientId: _recipientId,
  onSuccess,
}) => {
  const { sendEchoRequest, isLoading } = useSendEchoRequest();

  const handleEcho = async () => {
    try {
      await sendEchoRequest(whisperId);
      onSuccess?.();
    } catch (error) {
      // Error is handled in the hook with toast
      console.error('Failed to send echo request:', error);
    }
  };

  return (
    <Button
      onClick={handleEcho}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="h-4 w-4" />
      )}
      <span>{isLoading ? 'Sending...' : 'Echo Back'}</span>
    </Button>
  );
};
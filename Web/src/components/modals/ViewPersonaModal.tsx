/**
 * View Persona Modal Component
 *
 * Modal for viewing a user's persona and sending whispers.
 * Slides up from bottom with overlay, displays persona details and whisper form.
 */

import React, { useState } from 'react';
import { Button } from '../../components';

interface Persona {
  id: string;
  mood: string;
  career: string;
  interests: string[];
}

interface ViewPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  persona: Persona | null;
  onSendWhisper: (message: string) => void;
  remainingWhispers: number;
  isLoading?: boolean;
}

export const ViewPersonaModal: React.FC<ViewPersonaModalProps> = ({
  isOpen,
  onClose,
  persona,
  onSendWhisper,
  remainingWhispers,
  isLoading = false,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendWhisper = async () => {
    if (!message.trim() || !persona) return;

    setIsSending(true);
    try {
      await onSendWhisper(message.trim());
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Failed to send whisper:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  if (!isOpen || !persona) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-neutral-900 bg-opacity-75 z-40"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-800 rounded-t-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-neutral-100 mb-2">
              Anonymous Persona
            </h2>
            <div className="text-lg text-neutral-100">
              Mood: <span className="font-bold text-accent-500">{persona.mood}</span>
            </div>
          </div>

          {/* Career */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-neutral-100">
              {persona.career}
            </h3>
          </div>

          {/* Interests */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {persona.interests.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-neutral-700 text-neutral-100 rounded-md text-sm border border-neutral-600"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-700 mb-6" />

          {/* Send Whisper Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-neutral-100 mb-4">
              Send your Whisper
            </h3>

            <div className="space-y-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send an anonymous, encrypted message..."
                className="w-full h-32 px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-neutral-100 placeholder-neutral-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                disabled={isLoading || isSending}
              />

              <div className="text-sm text-neutral-400">
                ... ({remainingWhispers} left today)
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              disabled={isLoading || isSending}
            >
              Attach Image
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              onClick={handleSendWhisper}
              disabled={!message.trim() || isLoading || isSending}
              loading={isSending}
            >
              Send Whisper
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewPersonaModal;
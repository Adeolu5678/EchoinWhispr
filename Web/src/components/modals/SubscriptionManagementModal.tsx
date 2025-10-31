/**
 * Subscription Management Modal Component
 *
 * Modal for managing subscriptions, allowing upgrade from Free Tier to Premium.
 * Displays current subscription status and payment options.
 */

import React, { useState } from 'react';
import { Button } from '../../components';

interface SubscriptionManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeHBAR: () => Promise<void>;
  onSubscribeHTS: () => Promise<void>;
  isSubscribed: boolean;
  expiresOn?: string;
  remainingWhispers: number;
  isLoading?: boolean;
}

export const SubscriptionManagementModal: React.FC<SubscriptionManagementModalProps> = ({
  isOpen,
  onClose,
  onSubscribeHBAR,
  onSubscribeHTS,
  isSubscribed,
  expiresOn,
  remainingWhispers,
  isLoading = false,
}) => {
  const [isSubscribingHBAR, setIsSubscribingHBAR] = useState(false);
  const [isSubscribingHTS, setIsSubscribingHTS] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubscribeHBAR = async () => {
    setIsSubscribingHBAR(true);
    setError(null);
    setSuccess(null);
    try {
      await onSubscribeHBAR();
      setSuccess('Successfully subscribed with HBAR! Your premium access is now active.');
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      setError('Failed to subscribe with HBAR. Please try again.');
      console.error('HBAR subscription failed:', err);
    } finally {
      setIsSubscribingHBAR(false);
    }
  };

  const handleSubscribeHTS = async () => {
    setIsSubscribingHTS(true);
    setError(null);
    setSuccess(null);
    try {
      await onSubscribeHTS();
      setSuccess('Successfully subscribed with HTS! Your premium access is now active.');
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      setError('Failed to subscribe with HTS. Please try again.');
      console.error('HTS subscription failed:', err);
    } finally {
      setIsSubscribingHTS(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-neutral-900 bg-opacity-75 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="bg-neutral-800 rounded-lg shadow-lg max-w-md w-full z-50">
        <div className="p-6">
          {/* Header */}
          <h2 className="text-2xl font-semibold text-neutral-100 mb-4 text-center">
            Manage Subscription
          </h2>

          {/* Current Status */}
          <div className="mb-6 p-4 bg-neutral-700 border border-neutral-600 rounded-lg">
            <p className="text-neutral-100 text-sm mb-2">
              Current Status:{' '}
              {isSubscribed ? (
                <span className="text-green-400 font-medium">
                  Premium (Expires {expiresOn})
                </span>
              ) : (
                <span className="text-red-400 font-medium">
                  Free Tier ({remainingWhispers}/5 Whispers remaining)
                </span>
              )}
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Subscription Options */}
          {!isSubscribed && (
            <div className="space-y-3 mb-6">
              {/* HBAR Option */}
              <div className="border border-neutral-700 rounded-lg p-4 bg-neutral-850">
                <div className="text-lg font-semibold text-neutral-100 mb-2">
                  10 HBAR (30 Days Premium)
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSubscribeHBAR}
                  disabled={isLoading || isSubscribingHBAR || isSubscribingHTS}
                  loading={isSubscribingHBAR}
                >
                  Subscribe with HBAR
                </Button>
              </div>

              {/* HTS Option */}
              <div className="border border-neutral-700 rounded-lg p-4 bg-neutral-850">
                <div className="text-lg font-semibold text-neutral-100 mb-2">
                  100 HTS (30 Days Premium)
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleSubscribeHTS}
                  disabled={isLoading || isSubscribingHBAR || isSubscribingHTS}
                  loading={isSubscribingHTS}
                >
                  Subscribe with HTS
                </Button>
              </div>
            </div>
          )}

          {/* If already subscribed */}
          {isSubscribed && (
            <div className="mb-6 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">
                You are currently on Premium. Your subscription will renew automatically or you can manage it through your wallet.
              </p>
            </div>
          )}

          {/* Close Button */}
          <Button
            variant="secondary"
            className="w-full"
            onClick={onClose}
            disabled={isLoading || isSubscribingHBAR || isSubscribingHTS}
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
};

export default SubscriptionManagementModal;
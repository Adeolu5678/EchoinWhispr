/**
 * Paywall Modal Component
 *
 * Modal for daily whisper limit reached, offering subscription options.
 * Centered modal with overlay, displays limit info and payment options.
 */

import React, { useState } from 'react';
import { Button } from '../../components';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeHBAR: () => void;
  onSubscribeHTS: () => void;
  onNoThanks: () => void;
  remainingHours: number;
  isLoading?: boolean;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onSubscribeHBAR,
  onSubscribeHTS,
  onNoThanks,
  remainingHours,
  isLoading = false,
}) => {
  const [isSubscribingHBAR, setIsSubscribingHBAR] = useState(false);
  const [isSubscribingHTS, setIsSubscribingHTS] = useState(false);

  const handleSubscribeHBAR = async () => {
    setIsSubscribingHBAR(true);
    try {
      await onSubscribeHBAR();
    } catch (error) {
      console.error('HBAR subscription failed:', error);
    } finally {
      setIsSubscribingHBAR(false);
    }
  };

  const handleSubscribeHTS = async () => {
    setIsSubscribingHTS(true);
    try {
      await onSubscribeHTS();
    } catch (error) {
      console.error('HTS subscription failed:', error);
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
        <div className="p-6 text-center">
          {/* Icon */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-warning-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Header */}
          <h2 className="text-2xl font-semibold text-neutral-100 mb-4">
            Daily Whisper Limit Reached
          </h2>

          {/* Body Text */}
          <div className="text-base text-neutral-400 mb-4">
            <p className="mb-2">
              You have used your 5 free Whispers for today. This limit resets in{' '}
              <span className="text-accent-500 font-semibold">{remainingHours} hours</span>.
            </p>
            <p className="text-neutral-100">
              To send unlimited new Whispers, get a 30-day subscription.
            </p>
          </div>

          {/* Subscription Options */}
          <div className="space-y-3 mb-6">
            {/* HBAR Option */}
            <div className="border border-neutral-700 rounded-lg p-4 bg-neutral-850">
              <div className="text-lg font-semibold text-neutral-100 mb-2">
                [X] HBAR (30 Days)
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
                [X] HTS (30 Days)
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

          {/* No Thanks Link */}
          <button
            onClick={onNoThanks}
            className="text-sm text-neutral-400 hover:text-neutral-300 underline"
            disabled={isLoading || isSubscribingHBAR || isSubscribingHTS}
          >
            No thanks, I&apos;ll wait.
          </button>
        </div>
      </div>
    </>
  );
};

export default PaywallModal;
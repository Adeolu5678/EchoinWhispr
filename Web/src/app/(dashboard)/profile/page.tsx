'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../lib/walletProvider';
import { useUserAuthentication, useUserPersonaUpdate } from '../../../lib/hooks';
import { Button } from '../../../components';
import { Input } from '../../../components';
import { SubscriptionManagementModal } from '../../../components/modals/SubscriptionManagementModal';
import { UserManagementService } from '../../../lib/hedera';

interface ProfileFormData {
  career: string;
  interests: string[];
  currentMood: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { isConnected, accountId } = useWallet();
  const { userProfile, isAuthenticated, refreshProfile } = useUserAuthentication();
  const { updatePersona, isUpdating, updateError, clearError } = useUserPersonaUpdate();

  const [formData, setFormData] = useState<ProfileFormData>({
    career: '',
    interests: [],
    currentMood: '',
  });

  const [interestInput, setInterestInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<{
    isSubscribed: boolean;
    remainingWhispers: number;
    expiresOn?: string;
  }>({
    isSubscribed: false,
    remainingWhispers: 5,
  });
  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);

  // Initialize form data from user profile
  useEffect(() => {
    if (userProfile && userProfile.isInitialized) {
      setFormData({
        career: userProfile.career,
        interests: userProfile.interests,
        currentMood: userProfile.currentMood,
      });

      // Check subscription status
      const now = Math.floor(Date.now() / 1000);
      const isSubscribed = userProfile.subscriptionEnds > now;
      const remainingWhispers = isSubscribed ? -1 : 5; // -1 means unlimited for premium

      setSubscriptionStatus({
        isSubscribed,
        remainingWhispers,
        expiresOn: isSubscribed ? new Date(userProfile.subscriptionEnds * 1000).toLocaleDateString() : undefined,
      });
    }
  }, [userProfile]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError();
    setSuccessMessage('');
  };

  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed && !formData.interests.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, trimmed]
      }));
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !accountId || !userProfile) {
      return;
    }

    try {
      await updatePersona({
        career: formData.career,
        interests: formData.interests,
        currentMood: formData.currentMood,
      });

      setSuccessMessage('Persona updated successfully!');
      await refreshProfile(); // Refresh the profile data

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleSubscribeHBAR = async () => {
    const userManagement = UserManagementService.getInstance();
    await userManagement.subscribeWithHBAR(10000000000); // 10 HBAR in tinybars
    await refreshProfile(); // Refresh profile to update subscription status
  };

  const handleSubscribeHTS = async () => {
    const userManagement = UserManagementService.getInstance();
    await userManagement.subscribeWithHTS(100); // 100 HTS tokens
    await refreshProfile(); // Refresh profile to update subscription status
  };

  // Redirect if not connected or not authenticated
  if (!isConnected || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">Access Denied</h1>
          <p className="text-neutral-400 mb-6">
            Please connect your wallet and ensure you&apos;re authenticated to access your profile.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="w-full"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-100">Your Anonymous Persona</h2>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {updateError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{updateError}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Career */}
          <Input
            label="Your Career"
            name="career"
            value={formData.career}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('career', e.target.value)}
            placeholder="e.g., Software Engineer"
            required
          />

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-2">
              Your Interests
            </label>
            <div className="flex gap-2 mb-3">
              <Input
                name="interestInput"
                value={interestInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInterestInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add an interest and press Enter"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddInterest}
                variant="outline"
                size="sm"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-500/20 text-primary-400 border border-primary-500/30"
                >
                  {interest}
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="ml-2 text-primary-400 hover:text-primary-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Current Mood */}
          <div>
            <label className="block text-sm font-medium text-neutral-100 mb-2">
              Your Current Mood
            </label>
            <select
              name="currentMood"
              value={formData.currentMood}
              onChange={(e) => handleInputChange('currentMood', e.target.value)}
              className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Select your mood</option>
              <option value="Creative">Creative</option>
              <option value="Focused">Focused</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Energetic">Energetic</option>
              <option value="Thoughtful">Thoughtful</option>
              <option value="Adventurous">Adventurous</option>
              <option value="Calm">Calm</option>
              <option value="Inspired">Inspired</option>
            </select>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isUpdating || !formData.career.trim() || !formData.currentMood || formData.interests.length === 0}
            loading={isUpdating}
            className="w-full"
          >
            {isUpdating ? 'Updating Persona...' : 'Update Persona & Sign'}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-8 border-t border-neutral-700"></div>

        {/* Subscription Section */}
        <div>
          <h3 className="text-lg font-medium text-neutral-100 mb-4">Subscription</h3>
          <div className="p-4 bg-neutral-700 border border-neutral-600 rounded-lg">
            <p className="text-neutral-100 text-sm mb-2">
              Status:{' '}
              {subscriptionStatus.isSubscribed ? (
                <span className="text-green-400 font-medium">
                  Premium (Expires {subscriptionStatus.expiresOn})
                </span>
              ) : (
                <span className="text-red-400 font-medium">
                  Free Tier ({subscriptionStatus.remainingWhispers}/5 Whispers remaining)
                </span>
              )}
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => setIsSubscriptionModalOpen(true)}
            >
              Manage Subscription
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription Management Modal */}
      <SubscriptionManagementModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => setIsSubscriptionModalOpen(false)}
        onSubscribeHBAR={handleSubscribeHBAR}
        onSubscribeHTS={handleSubscribeHTS}
        isSubscribed={subscriptionStatus.isSubscribed}
        expiresOn={subscriptionStatus.expiresOn}
        remainingWhispers={subscriptionStatus.remainingWhispers}
      />
    </div>
  );
}
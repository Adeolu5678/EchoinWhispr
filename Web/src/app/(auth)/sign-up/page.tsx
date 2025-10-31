'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../lib/walletProvider';
import { useUserRegistration } from '../../../lib/hooks';
import { EncryptionService } from '../../../lib/encryption';
import { Button } from '../../../components';
import { Input } from '../../../components';

interface SignUpFormData {
  career: string;
  interests: string[];
  currentMood: string;
  publicKey: string;
  mailHash: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const { isConnected, accountId } = useWallet();
  const { registerUser, isRegistering, registrationError, clearError } = useUserRegistration();

  const [formData, setFormData] = useState<SignUpFormData>({
    career: '',
    interests: [],
    currentMood: '',
    publicKey: '',
    mailHash: '',
  });

  const [interestInput, setInterestInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize encryption service and generate keys on component mount
  useEffect(() => {
    const initializeKeys = async () => {
      if (accountId) {
        const service = new EncryptionService();
        const publicKeyHex = service.getPublicKeyHex();
        const salt = crypto.getRandomValues(new Uint8Array(32));
        const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
        const mailHash = await EncryptionService.generateMailHash(accountId, saltHex);

        setFormData(prev => ({
          ...prev,
          publicKey: publicKeyHex,
          mailHash: mailHash,
        }));
      }
    };

    initializeKeys();
  }, [accountId]);

  const handleInputChange = (field: keyof SignUpFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError();
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

    if (!isConnected || !accountId) {
      return;
    }

    try {
      await registerUser({
        career: formData.career,
        interests: formData.interests,
        currentMood: formData.currentMood,
        publicKey: formData.publicKey,
        mailHash: formData.mailHash,
      });

      setSuccessMessage('Registration successful! Redirecting...');
      setTimeout(() => {
        router.push('/search'); // Redirect to main dashboard (search tab)
      }, 2000);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  // Redirect if not connected
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">Connect Your Wallet</h1>
          <p className="text-neutral-400 mb-6">
            Please connect your Hedera wallet to create your anonymous persona.
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
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-neutral-100">Echoin</span>
            <span className="text-primary-500">Whispr</span>
          </h1>
          <p className="text-neutral-400 mt-2 text-sm">Connect by Merit. Not by Status.</p>
        </div>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-neutral-100">Create Your Anonymous Persona</h2>
          <p className="text-neutral-400 text-sm mt-2">
            This is your on-chain profile. It is anonymous and can be edited at any time.
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
            <p className="text-green-400 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {registrationError && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/20 rounded-lg">
            <p className="text-red-400 text-sm">{registrationError}</p>
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

          {/* Info Box */}
          <div className="p-4 bg-neutral-700 border border-neutral-600 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="text-primary-400 mt-0.5">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-neutral-300 text-sm">
                Your encryption keys and anonymous &apos;mail hash&apos; will be generated locally and stored securely on-chain.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isRegistering || !formData.career.trim() || !formData.currentMood || formData.interests.length === 0}
            loading={isRegistering}
            className="w-full"
          >
            {isRegistering ? 'Creating Persona...' : 'Create Persona & Sign'}
          </Button>
        </form>
      </div>
    </div>
  );
}
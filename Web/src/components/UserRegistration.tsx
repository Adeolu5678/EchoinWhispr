'use client';

import React, { useState } from 'react';
import { useUserRegistration } from '../lib/hooks';
import { UserRegistrationData } from '../lib/hedera';
import { useWallet } from '../lib/walletProvider';

interface UserRegistrationProps {
  onRegistrationSuccess?: () => void;
  onCancel?: () => void;
}

export const UserRegistration: React.FC<UserRegistrationProps> = ({
  onRegistrationSuccess,
  onCancel,
}) => {
  const { isConnected } = useWallet();
  const { registerUser, isRegistering, registrationError, clearError } = useUserRegistration();

  const [formData, setFormData] = useState<UserRegistrationData>({
    career: '',
    interests: [],
    currentMood: '',
    publicKey: '',
    mailHash: '',
  });

  const [interestInput, setInterestInput] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (field: keyof UserRegistrationData, value: string) => {
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

    if (!isConnected) {
      return;
    }

    try {
      await registerUser(formData);
      setSuccessMessage('Registration successful! You can now use the platform.');
      setTimeout(() => {
        onRegistrationSuccess?.();
      }, 2000);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-4">
            Please connect your Hedera wallet to register as a user.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-center">Create Your Anonymous Persona</h2>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {registrationError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {registrationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="career" className="block text-sm font-medium text-gray-700 mb-1">
            Career
          </label>
          <input
            type="text"
            id="career"
            value={formData.career}
            onChange={(e) => handleInputChange('career', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Software Engineer"
            required
          />
        </div>

        <div>
          <label htmlFor="interests" className="block text-sm font-medium text-gray-700 mb-1">
            Interests
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add an interest and press Enter"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="mood" className="block text-sm font-medium text-gray-700 mb-1">
            Current Mood
          </label>
          <select
            id="mood"
            value={formData.currentMood}
            onChange={(e) => handleInputChange('currentMood', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div>
          <label htmlFor="publicKey" className="block text-sm font-medium text-gray-700 mb-1">
            Public Key (Hex)
          </label>
          <input
            type="text"
            id="publicKey"
            value={formData.publicKey}
            onChange={(e) => handleInputChange('publicKey', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label htmlFor="mailHash" className="block text-sm font-medium text-gray-700 mb-1">
            Mail Hash (Hex)
          </label>
          <input
            type="text"
            id="mailHash"
            value={formData.mailHash}
            onChange={(e) => handleInputChange('mailHash', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder="0x..."
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isRegistering}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isRegistering}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRegistering ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};
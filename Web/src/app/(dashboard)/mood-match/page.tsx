'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../../components';
import { HederaSmartContracts } from '../../../lib/hedera/smartContracts';

// Types for mood matching functionality
interface MoodMatch {
  address: string;
  career: string;
  interests: string[];
  currentMood: string;
}

const MoodMatchPage: React.FC = () => {
  // State management
  const [userMood, setUserMood] = useState<string>('');
  const [moodMatch, setMoodMatch] = useState<MoodMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [smartContracts, setSmartContracts] = useState<HederaSmartContracts | null>(null);

  // Initialize smart contracts service
  useEffect(() => {
    const initializeSmartContracts = async () => {
      try {
        // In a real implementation, get these from wallet context or environment
        const network = process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet';
        const accountId = process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || '';
        const privateKey = process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY || '';

        if (accountId && privateKey) {
          const contracts = new HederaSmartContracts(network, accountId, privateKey);
          setSmartContracts(contracts);
        }
      } catch (err) {
        console.error('Failed to initialize smart contracts:', err);
      }
    };

    initializeSmartContracts();
  }, []);

  // Initialize user mood on mount
  useEffect(() => {
    const initializeUserMood = async () => {
      try {
        // In a real implementation, get current user's mood from their profile
        // For now, we'll use a mock mood
        setUserMood('Creative');
      } catch (err) {
        console.error('Failed to initialize user mood:', err);
      }
    };

    initializeUserMood();
  }, []);

  const findMoodMatch = async () => {
    if (!smartContracts) {
      setError('Smart contracts service not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMoodMatch(null);

    try {
      // Call the smart contract to find a mood match
      const matchAddress = await smartContracts.findMoodMatch(userMood);

      if (matchAddress) {
        // Get the matched user's profile
        const profile = await smartContracts.getUserProfile(matchAddress);

        if (profile) {
          const match: MoodMatch = {
            address: matchAddress,
            career: profile.career || 'Unknown Career',
            interests: profile.interests || [],
            currentMood: profile.currentMood || userMood
          };
          setMoodMatch(match);
        } else {
          setError('Failed to retrieve matched user profile');
        }
      } else {
        setError('No mood match found. Try again later!');
      }
    } catch (err) {
      console.error('Failed to find mood match:', err);
      setError(err instanceof Error ? err.message : 'Failed to find mood match');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPersonaCard = (persona: MoodMatch) => (
    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm text-neutral-400">
            Mood: <span className={`font-bold ${persona.currentMood === 'Creative' ? 'text-accent-500' : 'text-neutral-100'}`}>
              {persona.currentMood}
            </span>
          </p>
          <h3 className="text-lg font-semibold text-neutral-100 mt-1">{persona.career}</h3>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {persona.interests.map((interest, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-neutral-700 text-neutral-300 text-xs rounded-md"
          >
            {interest}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="text-white min-h-screen">
      <div className="max-w-2xl mx-auto p-4">
        {/* Mood Match Section */}
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 text-center">
          <h2 className="text-2xl font-bold text-neutral-100 mb-4">Find a Mood Match</h2>
          <p className="text-neutral-400 mb-6">
            Your current mood is <span className="font-bold text-accent-500">&apos;{userMood}&apos;</span>.
            Find another user who feels the same.
          </p>
          <Button
            onClick={findMoodMatch}
            loading={isLoading}
            variant="primary"
            size="lg"
            className="w-full max-w-xs mx-auto bg-accent-500 hover:bg-accent-600"
            disabled={!smartContracts}
          >
            {isLoading ? 'Finding Match...' : 'Find Match'}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8 mt-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <span className="ml-3 text-neutral-400">Finding your mood match...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4 mt-6">
            <p className="text-error-400">{error}</p>
          </div>
        )}

        {/* Mood Match Result */}
        {moodMatch && !isLoading && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-neutral-100 mb-4">Your Mood Match</h3>
            {renderPersonaCard(moodMatch)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodMatchPage;
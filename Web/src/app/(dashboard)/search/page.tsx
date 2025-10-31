'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '../../../components';
import { Input } from '../../../components';
import { HederaSmartContracts } from '../../../lib/hedera/smartContracts';

// Types for search functionality
interface PersonaCard {
  id: string;
  career: string;
  interests: string[];
  currentMood: string;
  address: string;
}

interface MoodMatch {
  address: string;
  career: string;
  interests: string[];
  currentMood: string;
}

const SearchPage: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'search' | 'mood'>('search');
  const [careerFilter, setCareerFilter] = useState('');
  const [interestsFilter, setInterestsFilter] = useState('');
  const [searchResults, setSearchResults] = useState<PersonaCard[]>([]);
  const [moodMatch, setMoodMatch] = useState<MoodMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userMood, setUserMood] = useState<string>('');

  // Services
  // const [userManagement] = useState(() => UserManagementService.getInstance()); // For future API integration

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

  const performSearch = async () => {
    if (!careerFilter.trim() && !interestsFilter.trim()) {
      setError('Please enter at least one search filter');
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Call smart contract to search users
      const smartContracts = new HederaSmartContracts(
        process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || '',
        process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY || ''
      );

      // Search users by career and interests
      const searchResults = await smartContracts.searchUsers(careerFilter, interestsFilter);

      // Transform results to match our interface
      const transformedResults: PersonaCard[] = searchResults.map((user: any, index: number) => ({
        id: (index + 1).toString(),
        career: user.career || 'Unknown Career',
        interests: user.interests || [],
        currentMood: user.currentMood || 'Unknown',
        address: user.address
      }));

      setSearchResults(transformedResults);
    } catch (err) {
      console.error('Failed to perform search:', err);
      setError(err instanceof Error ? err.message : 'Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const findMoodMatch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call smart contract to find mood match
      const smartContracts = new HederaSmartContracts(
        process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || '',
        process.env.NEXT_PUBLIC_HEDERA_PRIVATE_KEY || ''
      );

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

  const handleSendWhisper = (persona: PersonaCard) => {
    // In a real implementation, this would open a modal or navigate to whisper composition
    console.log('Send whisper to:', persona.address);
  };

  const renderPersonaCard = (persona: PersonaCard | MoodMatch, showSendButton = true) => (
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
        {showSendButton && (
          <Button
            onClick={() => handleSendWhisper(persona as PersonaCard)}
            variant="primary"
            size="sm"
          >
            Send Whisper
          </Button>
        )}
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
    <div className="text-white">
      {/* Tabs */}
      <div className="flex bg-neutral-800 border-b border-neutral-700">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-neutral-400 hover:text-neutral-300'
          }`}
        >
          Search & Filter
        </button>
        <button
          onClick={() => setActiveTab('mood')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'mood'
              ? 'text-primary-500 border-b-2 border-primary-500'
              : 'text-neutral-400 hover:text-neutral-300'
          }`}
        >
          Mood Match
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'search' ? (
          <div className="space-y-6">
            {/* Search Filters */}
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
              <h2 className="text-lg font-semibold text-neutral-100 mb-4">Find Users</h2>
              <div className="space-y-4">
                <Input
                  label="Filter by Career"
                  value={careerFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCareerFilter(e.target.value)}
                  placeholder="e.g., Solidity Developer"
                  className="bg-neutral-700 border-neutral-600 text-white"
                />
                <Input
                  label="Filter by Interests"
                  value={interestsFilter}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInterestsFilter(e.target.value)}
                  placeholder="e.g., DeFi, NFTs"
                  className="bg-neutral-700 border-neutral-600 text-white"
                />
                <Button
                  onClick={performSearch}
                  loading={isSearching}
                  variant="primary"
                  className="w-full"
                >
                  Search Users
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isSearching && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-neutral-400">Syncing user directory...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4">
                <p className="text-error-400">{error}</p>
              </div>
            )}

            {/* Search Results */}
            {!isSearching && searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-100">Search Results</h3>
                {searchResults.map((persona) => (
                  <div key={persona.id}>
                    {renderPersonaCard(persona)}
                  </div>
                ))}
              </div>
            )}

            {!isSearching && searchResults.length === 0 && careerFilter && (
              <div className="text-center py-8">
                <p className="text-neutral-400">No users found matching your criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Mood Match Section */}
            <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
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
              >
                Find Match
              </Button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <span className="ml-3 text-neutral-400">Finding your mood match...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-error-500/10 border border-error-500/20 rounded-lg p-4">
                <p className="text-error-400">{error}</p>
              </div>
            )}

            {/* Mood Match Result */}
            {moodMatch && !isLoading && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-neutral-100">Your Mood Match</h3>
                {renderPersonaCard(moodMatch, false)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
'use client';

import React, { useEffect } from 'react';
import { useUserAuthentication } from '../lib/hooks';
import { useWallet } from '../lib/walletProvider';

interface UserAuthenticationProps {
  onAuthenticated?: () => void;
  onNeedsRegistration?: () => void;
}

export const UserAuthentication: React.FC<UserAuthenticationProps> = ({
  onAuthenticated,
  onNeedsRegistration,
}) => {
  const { isConnected, connectWallet } = useWallet();
  const {
    userProfile,
    isAuthenticated,
    isLoading,
    authenticationError,
    checkAuthentication,
    clearError,
  } = useUserAuthentication();

  useEffect(() => {
    if (isAuthenticated && onAuthenticated) {
      onAuthenticated();
    } else if (isConnected && !isLoading && !isAuthenticated && onNeedsRegistration) {
      onNeedsRegistration();
    }
  }, [isAuthenticated, isConnected, isLoading, onAuthenticated, onNeedsRegistration]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      clearError();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  if (!isConnected) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-6">
            Connect your Hedera wallet to access the decentralized messaging platform.
          </p>
          <button
            onClick={handleConnectWallet}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }

  if (authenticationError) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="font-semibold">Authentication Error</p>
          </div>
          <p className="text-gray-600 mb-4">{authenticationError}</p>
          <button
            onClick={checkAuthentication}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isAuthenticated && userProfile) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Welcome Back!</h2>
          <p className="text-gray-600 mb-4">You are successfully authenticated.</p>

          <div className="text-left bg-gray-50 p-4 rounded-md mb-4">
            <h3 className="font-medium mb-2">Your Persona:</h3>
            <p className="text-sm text-gray-600"><strong>Career:</strong> {userProfile.career}</p>
            <p className="text-sm text-gray-600"><strong>Mood:</strong> {userProfile.currentMood}</p>
            <p className="text-sm text-gray-600"><strong>Interests:</strong> {userProfile.interests.join(', ')}</p>
            {userProfile.subscriptionEnds > Date.now() / 1000 && (
              <p className="text-sm text-green-600">
                <strong>Subscription:</strong> Active until {new Date(userProfile.subscriptionEnds * 1000).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // This state shouldn't be reached, but just in case
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <p className="text-gray-600">Checking authentication status...</p>
      </div>
    </div>
  );
};
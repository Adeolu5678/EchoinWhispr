'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '../../../lib/walletProvider';
import { useUserAuthentication } from '../../../lib/hooks';
import { Button } from '../../../components';

export default function SignInPage() {
  const router = useRouter();
  const { isConnected, connectWallet } = useWallet();
  const { isAuthenticated, isLoading, authenticationError, checkAuthentication, clearError } = useUserAuthentication();
  const [isConnecting, setIsConnecting] = useState(false);

  // Check authentication when wallet connects
  useEffect(() => {
    if (isConnected && !isLoading) {
      checkAuthentication();
    }
  }, [isConnected, isLoading, checkAuthentication]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    clearError();
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // Show loading while checking authentication
  if (isConnected && isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show error if authentication failed
  if (isConnected && authenticationError) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8 text-center">
          <div className="text-red-400 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="font-semibold">Authentication Failed</p>
          </div>
          <p className="text-neutral-400 mb-6">{authenticationError}</p>
          <div className="space-y-3">
            <Button onClick={checkAuthentication} className="w-full">
              Try Again
            </Button>
            <Button
              onClick={() => router.push('/sign-up')}
              variant="outline"
              className="w-full"
            >
              Create Persona
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show message for non-authenticated users
  if (isConnected && !isAuthenticated && !isLoading) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-neutral-800 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-100 mb-4">Welcome Back</h1>
          <p className="text-neutral-400 mb-6">
            Your wallet is connected, but we couldn&apos;t find your persona. Please create one to continue.
          </p>
          <Button
            onClick={() => router.push('/sign-up')}
            className="w-full"
          >
            Create Persona
          </Button>
        </div>
      </div>
    );
  }

  // Default connect wallet screen
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold">
            <span className="text-neutral-100">Echoin</span>
            <span className="text-primary-500">Whispr</span>
          </h1>
        </div>

        {/* Tagline */}
        <div className="mb-4">
          <h3 className="text-xl font-normal text-neutral-400">Connect by Merit. Not by Status.</h3>
        </div>

        {/* Body Text */}
        <div className="mb-8">
          <p className="text-base text-neutral-100">
            Welcome. EchoinWhispr is a decentralized, anonymous social network. Connect your Hedera wallet to begin.
          </p>
        </div>

        {/* Connect Button */}
        <div className="mb-6">
          <Button
            onClick={handleConnectWallet}
            disabled={isConnecting}
            loading={isConnecting}
            className="w-full"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>

        {/* Link */}
        <div>
          <a
            href="#"
            className="text-sm text-primary-400 hover:text-primary-300 underline"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Open help modal or navigate to documentation
              alert('Hedera wallet information will be displayed here.');
            }}
          >
            What is a Hedera wallet?
          </a>
        </div>
      </div>
    </div>
  );
}
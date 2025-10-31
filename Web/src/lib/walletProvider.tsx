'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { HederaWalletService, UserManagementService } from './hedera';

interface WalletContextType {
  isConnected: boolean;
  accountId: string | null;
  publicKey: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  hederaWallet: HederaWalletService;
  userManagement: UserManagementService;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const hederaWallet = HederaWalletService.getInstance();
  const userManagement = UserManagementService.getInstance();

  useEffect(() => {
    // Check if wallet is already connected on mount
    const checkConnection = async () => {
      try {
        const storedAccountId = localStorage.getItem('hedera_account_id');
        const storedPublicKey = localStorage.getItem('hedera_public_key');

        if (storedAccountId && storedPublicKey) {
          setAccountId(storedAccountId);
          setPublicKey(storedPublicKey);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };

    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      // For Hedera integration, we'll use the HederaWalletService
      // This is a simplified implementation - in production, you'd integrate
      // with actual Hedera WalletConnect
      const result = await hederaWallet.connectWallet();

      setAccountId(result.accountId);
      setPublicKey(result.publicKey);
      setIsConnected(true);

      // Store connection info
      localStorage.setItem('hedera_account_id', result.accountId);
      localStorage.setItem('hedera_public_key', result.publicKey);

      // Check user registration status and navigate accordingly
      await checkUserRegistrationAndNavigate(result.accountId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      await hederaWallet.disconnectWallet();

      setAccountId(null);
      setPublicKey(null);
      setIsConnected(false);

      // Clear stored connection info
      localStorage.removeItem('hedera_account_id');
      localStorage.removeItem('hedera_public_key');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
      throw error;
    }
  };

  const checkUserRegistrationAndNavigate = async (userAccountId: string) => {
    try {
      const isRegistered = await userManagement.isUserAuthenticated(userAccountId);

      if (isRegistered) {
        // User is registered, navigate to main dashboard (search tab)
        router.push('/search');
      } else {
        // User is not registered, navigate to create persona page
        router.push('/sign-up');
      }
    } catch (error) {
      console.error('Failed to check user registration status:', error);
      // On error, default to sign-up page
      router.push('/sign-up');
    }
  };

  const value: WalletContextType = {
    isConnected,
    accountId,
    publicKey,
    connectWallet,
    disconnectWallet,
    hederaWallet,
    userManagement,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
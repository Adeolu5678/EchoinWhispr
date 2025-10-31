import { useState, useCallback } from 'react';
import { UserManagementService, UserRegistrationData } from '../hedera';
import { useWallet } from '../walletProvider';

export interface UseUserRegistrationReturn {
  registerUser: (data: UserRegistrationData) => Promise<void>;
  isRegistering: boolean;
  registrationError: string | null;
  clearError: () => void;
}

export const useUserRegistration = (): UseUserRegistrationReturn => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const { isConnected, accountId } = useWallet();

  const userManagement = UserManagementService.getInstance();

  const registerUser = useCallback(async (data: UserRegistrationData) => {
    if (!isConnected || !accountId) {
      setRegistrationError('Wallet not connected');
      return;
    }

    setIsRegistering(true);
    setRegistrationError(null);

    try {
      // Validate required fields
      if (!data.career.trim()) {
        throw new Error('Career field is required');
      }
      if (!data.currentMood.trim()) {
        throw new Error('Current mood is required');
      }
      if (!data.publicKey.trim()) {
        throw new Error('Public key is required');
      }
      if (!data.mailHash.trim()) {
        throw new Error('Mail hash is required');
      }
      if (data.interests.length === 0) {
        throw new Error('At least one interest is required');
      }

      // Validate interests against contract's fixed list
      const validInterests = ["DeFi", "NFTs", "Gaming", "AI", "Web3", "Crypto", "Art", "Music", "Sports", "Travel"];
      const invalidInterests = data.interests.filter(interest => !validInterests.includes(interest));
      if (invalidInterests.length > 0) {
        throw new Error(`Invalid interests: ${invalidInterests.join(', ')}. Must be one of: ${validInterests.join(', ')}`);
      }

      // Check if user is already registered
      const isAuthenticated = await userManagement.isUserAuthenticated(accountId);
      if (isAuthenticated) {
        throw new Error('User already registered');
      }

      // Register user on-chain
      await userManagement.registerUser(data);

      // Success - no need to set success state as the caller can check authentication status
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationError(error instanceof Error ? error.message : 'Registration failed');
      throw error; // Re-throw for component handling
    } finally {
      setIsRegistering(false);
    }
  }, [isConnected, accountId, userManagement]);

  const clearError = useCallback(() => {
    setRegistrationError(null);
  }, []);

  return {
    registerUser,
    isRegistering,
    registrationError,
    clearError,
  };
};
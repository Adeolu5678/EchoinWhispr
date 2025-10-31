import { useState, useEffect, useCallback } from 'react';
import { UserManagementService, UserProfile } from '../hedera';
import { useWallet } from '../walletProvider';

export interface UseUserAuthenticationReturn {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authenticationError: string | null;
  checkAuthentication: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

export const useUserAuthentication = (): UseUserAuthenticationReturn => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authenticationError, setAuthenticationError] = useState<string | null>(null);
  const { isConnected, accountId } = useWallet();

  const userManagement = UserManagementService.getInstance();

  const checkAuthentication = useCallback(async () => {
    if (!isConnected || !accountId) {
      setUserProfile(null);
      setAuthenticationError(null);
      return;
    }

    setIsLoading(true);
    setAuthenticationError(null);

    try {
      const isAuthenticated = await userManagement.isUserAuthenticated(accountId);

      if (isAuthenticated) {
        const profile = await userManagement.getUserProfile(accountId);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setAuthenticationError(error instanceof Error ? error.message : 'Authentication check failed');
      setUserProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, accountId, userManagement]);

  const refreshProfile = useCallback(async () => {
    if (!isConnected || !accountId) {
      return;
    }

    setIsLoading(true);
    setAuthenticationError(null);

    try {
      const profile = await userManagement.getUserProfile(accountId);
      setUserProfile(profile);
    } catch (error) {
      console.error('Profile refresh failed:', error);
      setAuthenticationError(error instanceof Error ? error.message : 'Profile refresh failed');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, accountId, userManagement]);

  const clearError = useCallback(() => {
    setAuthenticationError(null);
  }, []);

  // Check authentication when wallet connection status changes
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const isAuthenticated = userProfile !== null && userProfile.isInitialized;

  return {
    userProfile,
    isAuthenticated,
    isLoading,
    authenticationError,
    checkAuthentication,
    refreshProfile,
    clearError,
  };
};
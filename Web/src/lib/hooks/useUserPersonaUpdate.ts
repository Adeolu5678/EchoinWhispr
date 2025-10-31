import { useState, useCallback } from 'react';
import { UserManagementService } from '../hedera';
import { useWallet } from '../walletProvider';

export interface UseUserPersonaUpdateReturn {
  updatePersona: (updates: {
    career?: string;
    interests?: string[];
    currentMood?: string;
  }) => Promise<void>;
  isUpdating: boolean;
  updateError: string | null;
  clearError: () => void;
}

export const useUserPersonaUpdate = (): UseUserPersonaUpdateReturn => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { isConnected, accountId } = useWallet();

  const userManagement = UserManagementService.getInstance();

  const updatePersona = useCallback(async (updates: {
    career?: string;
    interests?: string[];
    currentMood?: string;
  }) => {
    if (!isConnected || !accountId) {
      setUpdateError('Wallet not connected');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      // Validate that at least one field is being updated
      if (!updates.career && !updates.interests && !updates.currentMood) {
        throw new Error('At least one field must be updated');
      }

      // Update persona on-chain
      await userManagement.updateUserPersona(updates);

      // Success - no need to set success state as the caller can refresh profile
    } catch (error) {
      console.error('Persona update failed:', error);
      setUpdateError(error instanceof Error ? error.message : 'Persona update failed');
      throw error; // Re-throw for component handling
    } finally {
      setIsUpdating(false);
    }
  }, [isConnected, accountId, userManagement]);

  const clearError = useCallback(() => {
    setUpdateError(null);
  }, []);

  return {
    updatePersona,
    isUpdating,
    updateError,
    clearError,
  };
};
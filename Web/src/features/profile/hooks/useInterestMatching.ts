import { useState } from 'react';
import { HederaSmartContracts } from '@/lib/hedera/smartContracts';

/**
 * useInterestMatching hook provides functionality for Hedera smart contract operations
 * related to interest-based anonymous matching.
 *
 * This hook contains implementations for deploying and interacting with Hedera smart contracts
 * for matching users based on shared interests.
 */
export const useInterestMatching = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isMatching, setIsMatching] = useState(false);

  /**
   * Deploys a Hedera smart contract for interest matching.
   * @param contractCode - The smart contract bytecode
   * @returns Promise resolving to contract ID
   */
  const deployMatchingContract = async (contractCode: string): Promise<string> => {
    setIsDeploying(true);

    try {
      const contractsService = new HederaSmartContracts(
        process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID!,
        process.env.HEDERA_PRIVATE_KEY!
      );

      const contractId = await contractsService.deployContract(contractCode);
      return contractId;
    } catch (error) {
      console.error('Failed to deploy matching contract:', error);
      throw error;
    } finally {
      setIsDeploying(false);
    }
  };

  /**
   * Queries matches from Hedera smart contract.
   * @param userInterests - Array of user interests
   * @param contractId - The deployed contract ID
   * @returns Promise resolving to array of matched user IDs
   */
  const queryMatches = async (userInterests: string[], contractId: string): Promise<string[]> => {
    setIsMatching(true);

    try {
      const contractsService = new HederaSmartContracts(
        process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID!,
        process.env.HEDERA_PRIVATE_KEY!
      );

      const result = await contractsService.queryContractFunction(
        contractId,
        'findMatches',
        userInterests
      );

      // Assuming the contract returns an array of user IDs
      return result ? result.toString().split(',') : [];
    } catch (error) {
      console.error('Failed to query matches:', error);
      return [];
    } finally {
      setIsMatching(false);
    }
  };

  /**
   * Executes a match transaction on Hedera smart contract.
   * @param userId - The user ID initiating the match
   * @param matchedUserId - The matched user ID
   * @param interests - Shared interests
   * @param contractId - The deployed contract ID
   * @returns Promise resolving to transaction result
   */
  const executeMatch = async (
    userId: string,
    matchedUserId: string,
    interests: string[],
    contractId: string
  ): Promise<{ transactionId: string; status: string }> => {
    setIsMatching(true);

    try {
      const contractsService = new HederaSmartContracts(
        process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID!,
        process.env.HEDERA_PRIVATE_KEY!
      );

      const { transactionId } = await contractsService.executeContractFunction(
        contractId,
        'executeMatch',
        [userId, matchedUserId, interests.join(',')]
      );

      return {
        transactionId: transactionId || `tx_${Date.now()}`,
        status: 'success'
      };
    } catch (error) {
      console.error('Failed to execute match:', error);
      return {
        transactionId: `tx_${Date.now()}`,
        status: 'failed'
      };
    } finally {
      setIsMatching(false);
    }
  };

  return {
    deployMatchingContract,
    queryMatches,
    executeMatch,
    isDeploying,
    isMatching,
  };
};
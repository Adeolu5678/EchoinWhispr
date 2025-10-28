import { useState } from 'react';
import { HederaIdentityServices } from '@/lib/hedera/identityServices';

/**
 * usePersonaAttestation hook provides functionality for Hedera attestation operations.
 *
 * This hook contains implementations for creating and validating Hedera attestations
 * for persona profile verification using Hedera identity services.
 */
export const usePersonaAttestation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Creates a Hedera attestation for persona data.
   * @param personaData - The persona data to attest
   * @returns Promise resolving to attestation ID
   */
  const createAttestation = async (personaData: {
    career?: string;
    skills?: string[];
    expertise?: string;
  }): Promise<string> => {
    setIsCreating(true);

    try {
      const identityService = new HederaIdentityServices(
        process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID!,
        process.env.HEDERA_PRIVATE_KEY!
      );

      // Create attestation with persona data as claims
      const attestationId = await identityService.createAttestation(
        process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID!, // issuer
        'persona_profile', // subject (could be user DID)
        personaData
      );

      return attestationId;
    } catch (error) {
      console.error('Failed to create attestation:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  /**
   * Validates a Hedera attestation.
   * @param attestationId - The attestation ID to validate
   * @returns Promise resolving to validation result
   */
  const validateAttestation = async (attestationId: string): Promise<boolean> => {
    setIsValidating(true);

    try {
      const identityService = new HederaIdentityServices(
        process.env.NEXT_PUBLIC_HEDERA_NETWORK || 'testnet',
        process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID!,
        process.env.HEDERA_PRIVATE_KEY!
      );

      const isValid = await identityService.verifyAttestation(attestationId);
      return isValid;
    } catch (error) {
      console.error('Failed to validate attestation:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    createAttestation,
    validateAttestation,
    isCreating,
    isValidating,
  };
};
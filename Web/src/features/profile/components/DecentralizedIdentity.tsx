'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useDecentralizedIdentity } from '../hooks/useDecentralizedIdentity';
import { useToast } from '@/hooks/use-toast';

/**
 * DecentralizedIdentity component for Hedera-based decentralized identity verification.
 *
 * This component provides UI for DID creation and verification functionality
 * using Hedera identity services.
 */
export const DecentralizedIdentity: React.FC = () => {
  const [did, setDid] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>('unverified');
  const [communityMemberships, setCommunityMemberships] = useState<string[]>([]);

  const {
    isCreatingDID,
    isVerifyingIdentity,
    createDID,
    verifyIdentity,
    getVerificationStatus,
    getCommunityMemberships
  } = useDecentralizedIdentity();

  const { toast } = useToast();

  useEffect(() => {
    // Load existing DID data on component mount
    const loadDIDData = async () => {
      if (did) {
        try {
          const status = await getVerificationStatus(did);
          const memberships = await getCommunityMemberships(did);
          setVerificationStatus(status);
          setCommunityMemberships(memberships);
        } catch (error) {
          console.error('Failed to load DID data:', error);
        }
      }
    };
    loadDIDData();
  }, [did, getVerificationStatus, getCommunityMemberships]);

  const handleCreateDID = async () => {
    try {
      const newDid = await createDID();
      if (newDid) {
        setDid(newDid);
        toast({
          title: 'Success',
          description: 'DID created successfully',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create DID',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyIdentity = async () => {
    if (!did) return;

    try {
      const isVerified = await verifyIdentity(did);
      setVerificationStatus(isVerified ? 'verified' : 'unverified');
      toast({
        title: 'Verification Complete',
        description: isVerified ? 'Identity verified successfully' : 'Identity verification failed',
        variant: isVerified ? 'default' : 'destructive',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to verify identity',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold">Decentralized Identity Verification</h3>
      <p className="text-sm text-gray-600">
        Create and verify your decentralized identity using Hedera services.
      </p>

      <div className="flex gap-2">
        <Button
          variant="default"
          onClick={handleCreateDID}
          disabled={isCreatingDID || !!did}
        >
          {isCreatingDID ? 'Creating...' : did ? 'DID Created' : 'Create DID'}
        </Button>

        <Button
          variant="outline"
          onClick={handleVerifyIdentity}
          disabled={isVerifyingIdentity || !did}
        >
          {isVerifyingIdentity ? 'Verifying...' : 'Verify Identity'}
        </Button>
      </div>

      <div className="text-xs text-gray-500">
        <p>DID: {did ? `${did.substring(0, 20)}...` : 'Not Created'}</p>
        <p>Verification Status: {verificationStatus}</p>
        <p>Community Memberships: {communityMemberships.length > 0 ? communityMemberships.join(', ') : 'None'}</p>
      </div>
    </div>
  );
};
'use client';

import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import type { Id } from '@/lib/convex';

/**
 * Hook for admin actions/mutations.
 */
export function useAdminActions() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Request promotion
  const requestPromotionMutation = useMutation(api.admin.requestAdminPromotion);
  
  // Approve/reject requests
  const approveRequestMutation = useMutation(api.admin.approveAdminRequest);
  const rejectRequestMutation = useMutation(api.admin.rejectAdminRequest);
  
  // Grant/revoke roles
  const grantRoleMutation = useMutation(api.admin.grantAdminRole);
  const revokeRoleMutation = useMutation(api.admin.revokeAdminRole);

  const requestPromotion = async (reason: string) => {
    setIsLoading(true);
    try {
      await requestPromotionMutation({ reason });
      toast({
        title: 'Request Submitted',
        description: 'Your admin request has been submitted for review.',
      });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: 'Request Failed',
        description: errorMessage || 'Failed to submit request.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const approveRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await approveRequestMutation({ requestId: requestId as Id<'adminRequests'> });
      toast({
        title: 'Request Approved',
        description: 'User has been granted admin privileges.',
      });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: 'Approval Failed',
        description: errorMessage || 'Failed to approve request.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectRequest = async (requestId: string) => {
    setIsLoading(true);
    try {
      await rejectRequestMutation({ requestId: requestId as Id<'adminRequests'> });
      toast({
        title: 'Request Rejected',
        description: 'Admin request has been rejected.',
      });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: 'Rejection Failed',
        description: errorMessage || 'Failed to reject request.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const grantAdminRole = async (username: string) => {
    setIsLoading(true);
    try {
      await grantRoleMutation({ username });
      toast({
        title: 'Admin Granted',
        description: `@${username} is now an admin.`,
      });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: 'Grant Failed',
        description: errorMessage || 'Failed to grant admin role.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const revokeAdminRole = async (userId: string) => {
    setIsLoading(true);
    try {
      await revokeRoleMutation({ userId: userId as Id<'users'> });
      toast({
        title: 'Admin Revoked',
        description: 'Admin privileges have been revoked.',
      });
      return true;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      toast({
        title: 'Revoke Failed',
        description: errorMessage || 'Failed to revoke admin role.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    requestPromotion,
    approveRequest,
    rejectRequest,
    grantAdminRole,
    revokeAdminRole,
  };
}

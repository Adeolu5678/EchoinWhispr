'use client';

import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import type { Id } from '@/lib/convex';

/**
 * Hook for admin data queries.
 */
export function useAdminData() {
  const adminStatus = useQuery(api.admin.isCurrentUserAdmin);
  const stats = useQuery(api.admin.getAdminDashboardStats);
  const pendingRequests = useQuery(api.admin.getPendingAdminRequests);
  const allAdmins = useQuery(api.admin.getAllAdmins);
  const myRequestStatus = useQuery(api.admin.getMyAdminRequestStatus);

  return {
    // Admin status
    isAdmin: adminStatus?.isAdmin ?? false,
    isSuperAdmin: adminStatus?.role === 'super_admin',
    role: adminStatus?.role ?? null,
    isLoading: adminStatus === undefined,

    // Dashboard stats
    stats: stats ?? null,
    statsLoading: stats === undefined,

    // Pending requests (super admin only)
    pendingRequests: pendingRequests ?? [],
    pendingRequestsLoading: pendingRequests === undefined,

    // All admins
    allAdmins: allAdmins ?? [],
    allAdminsLoading: allAdmins === undefined,

    // My request status (for regular users)
    myRequestStatus: myRequestStatus ?? null,
  };
}

/**
 * Hook for admin whisper monitoring.
 */
export function useAdminWhispers() {
  const whispersData = useQuery(api.admin.getAllWhispers, { limit: 20 });

  return {
    whispers: whispersData?.whispers ?? [],
    hasMore: whispersData?.hasMore ?? false,
    nextCursor: whispersData?.nextCursor ?? null,
    isLoading: whispersData === undefined,
  };
}

/**
 * Hook for getting whisper details.
 */
export function useWhisperDetails(whisperId: string | null) {
  const details = useQuery(
    api.admin.getWhisperDetails,
    whisperId ? { whisperId: whisperId as Id<'whispers'> } : 'skip'
  );

  return {
    details: details ?? null,
    isLoading: details === undefined,
  };
}

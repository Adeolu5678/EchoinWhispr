import { useQuery } from 'convex/react';
import { api } from '@/lib/convex';
import { Profile } from '../types';

/**
 * Hook to fetch the current user's profile data.
 *
 * @returns Object containing profile data, loading state, and error state
 */
export const useProfile = () => {
  const profile = useQuery(api.profiles.getProfile) as Profile | undefined | null;

  return {
    profile,
    isLoading: profile === undefined,
    error: null, // Convex handles errors internally
  };
};
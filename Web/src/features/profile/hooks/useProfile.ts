import { useQuery } from 'convex/react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/convex';
import { Profile } from '../types';

export const useProfile = () => {
  const [error, setError] = useState<Error | null>(null);
  
  const profile = useQuery(api.profiles.getProfile) as Profile | undefined | null;

  useEffect(() => {
    if (profile instanceof Error) {
      setError(profile);
    } else if (profile !== undefined) {
      setError(null);
    }
  }, [profile]);

  return {
    profile,
    isLoading: profile === undefined,
    error,
  };
};
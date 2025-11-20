import { useQuery } from 'convex/react';
import { api } from '../../../Convex/convex/_generated/api';

export function useFeatureFlags() {
  const flags = useQuery(api.featureFlags.getFeatureFlags);
  return flags || {};
}

export function useFeatureFlag(name: string) {
  const flags = useFeatureFlags();
  return flags[name] ?? false;
}

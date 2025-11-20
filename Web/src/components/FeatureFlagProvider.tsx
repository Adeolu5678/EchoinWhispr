'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useFeatureFlags } from '../hooks/useFeatureFlags';

const FeatureFlagContext = createContext<Record<string, boolean>>({});

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const flags = useFeatureFlags();

  return (
    <FeatureFlagContext.Provider value={flags}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlagContext() {
  return useContext(FeatureFlagContext);
}

export function useIsFeatureEnabled(featureName: string) {
  const flags = useFeatureFlagContext();
  return flags[featureName] ?? false;
}

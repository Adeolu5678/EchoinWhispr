/**
 * EchoinWhspr Design System - Button Component Interface
 *
 * Platform-agnostic button component interface and types.
 * Actual implementations are provided by platform-specific packages.
 */

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  style?: React.CSSProperties | any; // Platform-specific style type
  textStyle?: React.CSSProperties | any; // Platform-specific style type
  fullWidth?: boolean;
}

// This is just the interface - implementations are in platform-specific packages
// Web: Web/components/Button.tsx
// React Native: ReactNative/components/Button.tsx
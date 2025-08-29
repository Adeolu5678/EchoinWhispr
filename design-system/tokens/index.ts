/**
 * EchoinWhispr Design System - Design Tokens
 *
 * This file exports all design tokens for the EchoinWhispr design system.
 * Import this file to access colors, typography, spacing, and other design tokens.
 */

export * from './colors';
export * from './typography';
export * from './spacing';

// Re-export commonly used tokens for convenience
export { colors, getColor } from './colors';
export { typography, getFontSize, getFontWeight, getTextStyle } from './typography';
export { spacing, semanticSpacing, getSpacing, spacingPatterns } from './spacing';

// Design system configuration
export const designSystem = {
  name: 'EchoinWhispr',
  version: '1.0.0',
  description: 'Design system for EchoinWhispr anonymous messaging platform',
  author: 'EchoinWhispr Team',
} as const;

// Theme configuration for different modes
export const themes = {
  light: {
    colors: 'colors',
    background: 'background.primary',
    text: 'text.primary',
  },
  dark: {
    colors: 'colors',
    background: 'background.secondary',
    text: 'text.inverse',
  },
} as const;

export type ThemeMode = keyof typeof themes;
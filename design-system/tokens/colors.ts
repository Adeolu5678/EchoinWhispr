/**
 * EchoinWhispr Design System - Color Tokens
 *
 * This file defines the core color palette for the EchoinWhispr design system.
 * All colors are designed to meet WCAG 2.1 AA contrast standards.
 */

export const colors = {
  // Primary Brand Colors (Purple Theme)
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe', // Light purple for input backgrounds
    400: '#c084fc',
    500: '#a855f7', // Main primary color
    600: '#9333ea', // Deep purple for headers
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Neutral Colors (Grays)
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success color
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error color
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning color
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03',
  },

  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: '#fafafa',
    tertiary: '#f5f5f5',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#171717', // neutral-900
    secondary: '#525252', // neutral-600
    tertiary: '#737373', // neutral-500
    inverse: '#ffffff',
    disabled: '#a3a3a3', // neutral-400
  },

  // Border Colors
  border: {
    light: '#e5e5e5', // neutral-200
    medium: '#d4d4d4', // neutral-300
    dark: '#a3a3a3', // neutral-400
    focus: '#a855f7', // primary-500 (purple theme)
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
    colored: 'rgba(168, 85, 247, 0.15)', // primary-500 (purple) with opacity
  },
} as const;

// Type definitions for better TypeScript support
export type ColorToken = keyof typeof colors;
export type PrimaryColorScale = keyof typeof colors.primary;
export type NeutralColorScale = keyof typeof colors.neutral;
export type SemanticColorScale = keyof typeof colors.success;

// Helper function to get color values
export const getColor = (token: ColorToken, scale?: string) => {
  const colorGroup = colors[token];
  if (typeof colorGroup === 'string') {
    return colorGroup;
  }
  if (scale && typeof colorGroup === 'object') {
    return colorGroup[scale as keyof typeof colorGroup] || (colorGroup as any)['500'];
  }
  return (colorGroup as any)['500'];
};
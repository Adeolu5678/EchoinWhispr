/**
 * EchoinWhispr Design System - Color Tokens
 *
 * Premium neon-glass aesthetic with enhanced purple palette,
 * fuchsia accents, and refined dark mode backgrounds.
 * All colors designed for WCAG 2.1 AA contrast compliance.
 */

export const colors = {
  // Primary Brand Colors (Enhanced Purple/Violet)
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Main primary color
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Accent Colors (Fuchsia/Magenta for highlights)
  accent: {
    50: '#fdf4ff',
    100: '#fae8ff',
    200: '#f5d0fe',
    300: '#f0abfc',
    400: '#e879f9',
    500: '#d946ef', // Main accent color
    600: '#c026d3',
    700: '#a21caf',
    800: '#86198f',
    900: '#701a75',
    950: '#4a044e',
  },

  // Neutral Colors (Enhanced for dark mode)
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

  // Semantic Colors - Success (Enhanced green-emerald)
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981', // Main success color
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },

  // Semantic Colors - Error (Enhanced red)
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

  // Semantic Colors - Warning (Enhanced amber)
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

  // Semantic Colors - Info (Cyan/Teal)
  info: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4', // Main info color
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },

  // Background Colors - Premium dark mode
  background: {
    primary: '#0a0a0b',
    secondary: '#111113',
    tertiary: '#18181b',
    elevated: '#1f1f23',
    card: '#141416',
    overlay: 'rgba(0, 0, 0, 0.8)',
    overlayLight: 'rgba(0, 0, 0, 0.6)',
  },

  // Text Colors - Enhanced for dark mode
  text: {
    primary: '#fafafa',
    secondary: '#a1a1aa',
    tertiary: '#71717a',
    muted: '#52525b',
    inverse: '#09090b',
    disabled: '#3f3f46',
  },

  // Border Colors - Glass effect borders
  border: {
    subtle: 'rgba(255, 255, 255, 0.05)',
    light: 'rgba(255, 255, 255, 0.08)',
    medium: 'rgba(255, 255, 255, 0.12)',
    strong: 'rgba(255, 255, 255, 0.18)',
    focus: '#a855f7',
    accent: '#d946ef',
  },

  // Glow Colors - Neon effects
  glow: {
    primary: 'rgba(168, 85, 247, 0.5)',
    primarySubtle: 'rgba(168, 85, 247, 0.25)',
    primaryIntense: 'rgba(168, 85, 247, 0.7)',
    accent: 'rgba(217, 70, 239, 0.5)',
    accentSubtle: 'rgba(217, 70, 239, 0.25)',
    success: 'rgba(16, 185, 129, 0.4)',
    error: 'rgba(239, 68, 68, 0.4)',
  },

  // Shadow Colors - Premium depth
  shadow: {
    xs: 'rgba(0, 0, 0, 0.2)',
    sm: 'rgba(0, 0, 0, 0.3)',
    md: 'rgba(0, 0, 0, 0.4)',
    lg: 'rgba(0, 0, 0, 0.5)',
    xl: 'rgba(0, 0, 0, 0.6)',
    colored: 'rgba(168, 85, 247, 0.2)',
    coloredIntense: 'rgba(168, 85, 247, 0.35)',
    accent: 'rgba(217, 70, 239, 0.2)',
  },

  // Gradient Stops - For premium gradients
  gradient: {
    primary: {
      from: '#a855f7',
      via: '#9333ea',
      to: '#7c3aed',
    },
    accent: {
      from: '#d946ef',
      via: '#c026d3',
      to: '#a21caf',
    },
    mixed: {
      from: '#a855f7',
      via: '#d946ef',
      to: '#ec4899',
    },
    dark: {
      from: '#18181b',
      via: '#0a0a0b',
      to: '#000000',
    },
  },

  // Glass Effect Colors
  glass: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.08)',
    strong: 'rgba(255, 255, 255, 0.12)',
    primary: 'rgba(168, 85, 247, 0.08)',
    accent: 'rgba(217, 70, 239, 0.06)',
  },
} as const;

// Type definitions for better TypeScript support
export type ColorToken = keyof typeof colors;
export type PrimaryColorScale = keyof typeof colors.primary;
export type AccentColorScale = keyof typeof colors.accent;
export type NeutralColorScale = keyof typeof colors.neutral;
export type SemanticColorScale = keyof typeof colors.success;

// Helper function to get color values
export const getColor = (token: ColorToken, scale?: string) => {
  const colorGroup = colors[token];
  if (typeof colorGroup === 'string') {
    return colorGroup;
  }
  if (scale && typeof colorGroup === 'object') {
    return colorGroup[scale as keyof typeof colorGroup] || (colorGroup as Record<string, string>)['500'];
  }
  return (colorGroup as Record<string, string>)['500'];
};

// Helper to get CSS variable format
export const getCSSVar = (token: string) => `var(--color-${token})`;

// Preset gradient classes
export const gradients = {
  primary: 'bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700',
  accent: 'bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700',
  mixed: 'bg-gradient-to-r from-primary-500 via-accent-500 to-pink-500',
  radialGlow: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent',
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
    return colorGroup[scale as keyof typeof colorGroup] || (colorGroup as Record<string, string>)['500'];
  }
  return (colorGroup as Record<string, string>)['500'];
};
/**
 * EchoinWhispr Design System - Color Tokens
 *
 * Tech Blue & Creative Magenta palette.
 * All colors designed for WCAG 2.1 AA contrast compliance.
 */

export const colors = {
  // Primary Brand Colors - Tech Blue
  primary: {
    50: '#e6f7ff',
    100: '#b3e7ff',
    200: '#80d7ff',
    300: '#4dc7ff',
    400: '#66C7FF', // Light - for glows, focus rings, secondary links
    500: '#00A3FF', // Base - The "Tech" blue
    600: '#008EE6', // Hover - darker shade for primary hover
    700: '#007acc',
    800: '#0066b3',
    900: '#004d99',
    950: '#003366',
  },

  // Accent Colors - Creative Magenta
  accent: {
    50: '#fce6ff',
    100: '#f7b3ff',
    200: '#f280ff',
    300: '#ed4dff',
    400: '#e81aff',
    500: '#E000FF', // Base - The "Creative" magenta
    600: '#C700E6', // Hover - darker shade for accent hover
    700: '#ae00cc',
    800: '#9500b3',
    900: '#7c0099',
    950: '#630080',
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

  // Semantic Colors - Success
  success: {
    50: '#e6fff0',
    100: '#b3ffd6',
    200: '#80ffbc',
    300: '#4dffa2',
    400: '#1aff88',
    500: '#06C270', // Main success color
    600: '#05a35f',
    700: '#048a4f',
    800: '#03713f',
    900: '#02582f',
    950: '#013f1f',
  },

  // Semantic Colors - Error
  error: {
    50: '#ffeded',
    100: '#ffd0d0',
    200: '#ffb3b3',
    300: '#ff9696',
    400: '#ff7979',
    500: '#FF3B30', // Main error color
    600: '#e6352b',
    700: '#cc2f26',
    800: '#b32921',
    900: '#99231c',
    950: '#801d17',
  },

  // Semantic Colors - Warning
  warning: {
    50: '#fffbe6',
    100: '#fff5b3',
    200: '#ffef80',
    300: '#ffe94d',
    400: '#ffe31a',
    500: '#FFC700', // Main warning color
    600: '#e6b300',
    700: '#cc9f00',
    800: '#b38b00',
    900: '#997700',
    950: '#806300',
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
    focus: '#00A3FF',
    accent: '#E000FF',
  },

  // Glow Colors - Neon effects
  glow: {
    primary: 'rgba(0, 163, 255, 0.5)',
    primarySubtle: 'rgba(0, 163, 255, 0.25)',
    primaryIntense: 'rgba(0, 163, 255, 0.7)',
    accent: 'rgba(224, 0, 255, 0.5)',
    accentSubtle: 'rgba(224, 0, 255, 0.25)',
    success: 'rgba(6, 194, 112, 0.4)',
    error: 'rgba(255, 59, 48, 0.4)',
  },

  // Shadow Colors - Premium depth
  shadow: {
    xs: 'rgba(0, 0, 0, 0.2)',
    sm: 'rgba(0, 0, 0, 0.3)',
    md: 'rgba(0, 0, 0, 0.4)',
    lg: 'rgba(0, 0, 0, 0.5)',
    xl: 'rgba(0, 0, 0, 0.6)',
    light: 'rgba(0, 0, 0, 0.1)',
    medium: 'rgba(0, 0, 0, 0.2)',
    dark: 'rgba(0, 0, 0, 0.3)',
    colored: 'rgba(0, 163, 255, 0.2)',
    coloredIntense: 'rgba(0, 163, 255, 0.35)',
    accent: 'rgba(224, 0, 255, 0.2)',
  },

  // Gradient Stops - Tech Blue to Creative Magenta
  gradient: {
    primary: {
      from: '#66C7FF',
      via: '#00A3FF',
      to: '#008EE6',
    },
    accent: {
      from: '#E000FF',
      via: '#C700E6',
      to: '#ae00cc',
    },
    mixed: {
      from: '#00A3FF',
      via: '#008EE6',
      to: '#E000FF',
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
    primary: 'rgba(0, 163, 255, 0.08)',
    accent: 'rgba(224, 0, 255, 0.06)',
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
  primary: 'bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600',
  accent: 'bg-gradient-to-r from-accent-500 via-accent-600 to-accent-700',
  mixed: 'bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500',
  radialGlow: 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent',
} as const;

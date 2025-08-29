/**
 * EchoinWhispr Design System - Tailwind CSS Configuration
 *
 * This configuration integrates the EchoinWhispr design tokens with Tailwind CSS.
 * It provides a consistent theming system across all platforms.
 */

import { colors, typography, spacing } from './tokens';

const tailwindConfig = {
  // Content paths for purging (will be overridden by platform-specific configs)
  content: [],

  // Custom theme using our design tokens
  theme: {
    // Color palette
    colors: {
      // Primary brand colors
      primary: colors.primary,
      // Neutral colors
      neutral: colors.neutral,
      // Semantic colors
      success: colors.success,
      error: colors.error,
      warning: colors.warning,
      // Background colors
      background: colors.background,
      // Text colors
      text: colors.text,
      // Border colors
      border: colors.border,
      // Shadow colors
      shadow: colors.shadow,
      // Transparent and current color
      transparent: 'transparent',
      current: 'currentColor',
      // White and black
      white: '#ffffff',
      black: '#000000',
    },

    // Typography
    fontFamily: {
      primary: typography.fontFamily.primary,
      mono: typography.fontFamily.mono,
      sans: typography.fontFamily.primary,
    },

    fontSize: {
      xs: typography.fontSize.xs,
      sm: typography.fontSize.sm,
      base: typography.fontSize.base,
      lg: typography.fontSize.lg,
      xl: typography.fontSize.xl,
      '2xl': typography.fontSize['2xl'],
      '3xl': typography.fontSize['3xl'],
      '4xl': typography.fontSize['4xl'],
      '5xl': typography.fontSize['5xl'],
      '6xl': typography.fontSize['6xl'],
    },

    fontWeight: {
      thin: typography.fontWeight.thin,
      extralight: typography.fontWeight.extralight,
      light: typography.fontWeight.light,
      normal: typography.fontWeight.normal,
      medium: typography.fontWeight.medium,
      semibold: typography.fontWeight.semibold,
      bold: typography.fontWeight.bold,
      extrabold: typography.fontWeight.extrabold,
      black: typography.fontWeight.black,
    },

    // Spacing
    spacing: spacing,

    // Border radius
    borderRadius: {
      none: spacing[0],
      sm: spacing[1],
      DEFAULT: spacing[2],
      md: spacing[3],
      lg: spacing[4],
      xl: spacing[6],
      '2xl': spacing[8],
      '3xl': spacing[12],
      full: '9999px',
    },

    // Shadows
    boxShadow: {
      sm: `0 1px 2px 0 ${colors.shadow.light}`,
      DEFAULT: `0 1px 3px 0 ${colors.shadow.medium}, 0 1px 2px -1px ${colors.shadow.medium}`,
      md: `0 4px 6px -1px ${colors.shadow.medium}, 0 2px 4px -2px ${colors.shadow.medium}`,
      lg: `0 10px 15px -3px ${colors.shadow.dark}, 0 4px 6px -4px ${colors.shadow.dark}`,
      xl: `0 20px 25px -5px ${colors.shadow.dark}, 0 8px 10px -6px ${colors.shadow.dark}`,
      '2xl': `0 25px 50px -12px ${colors.shadow.dark}`,
      inner: `inset 0 2px 4px 0 ${colors.shadow.medium}`,
      none: 'none',
      colored: `0 4px 6px -1px ${colors.shadow.colored}, 0 2px 4px -2px ${colors.shadow.colored}`,
    },

    // Animation
    animation: {
      none: 'none',
      spin: 'spin 1s linear infinite',
      ping: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      bounce: 'bounce 1s infinite',
    },

    // Transitions
    transitionDuration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },

    transitionTimingFunction: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    },

    // Breakpoints (mobile-first)
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },

    // Container
    container: {
      center: true,
      padding: {
        DEFAULT: spacing[4],
        sm: spacing[6],
        lg: spacing[8],
        xl: spacing[12],
      },
    },

    // Z-index scale
    zIndex: {
      auto: 'auto',
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
    },
  },

  // Plugins
  plugins: [
    // Custom utilities for design system
    function({ addUtilities, theme }: any) {
      const newUtilities = {
        // Text styles
        '.text-h1': {
          fontSize: theme('fontSize.4xl[0]'),
          fontWeight: theme('fontWeight.bold'),
          lineHeight: theme('fontSize.4xl[1].lineHeight'),
          letterSpacing: theme('letterSpacing.tight'),
        },
        '.text-h2': {
          fontSize: theme('fontSize.3xl[0]'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('fontSize.3xl[1].lineHeight'),
          letterSpacing: theme('letterSpacing.tight'),
        },
        '.text-h3': {
          fontSize: theme('fontSize.2xl[0]'),
          fontWeight: theme('fontWeight.semibold'),
          lineHeight: theme('fontSize.2xl[1].lineHeight'),
          letterSpacing: theme('letterSpacing.normal'),
        },
        '.text-body': {
          fontSize: theme('fontSize.base[0]'),
          fontWeight: theme('fontWeight.normal'),
          lineHeight: theme('fontSize.base[1].lineHeight'),
          letterSpacing: theme('letterSpacing.normal'),
        },
        '.text-caption': {
          fontSize: theme('fontSize.sm[0]'),
          fontWeight: theme('fontWeight.normal'),
          lineHeight: theme('fontSize.sm[1].lineHeight'),
          letterSpacing: theme('letterSpacing.wide'),
        },

        // Focus styles
        '.focus-ring': {
          '@apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2': {},
        },

        // Touch targets
        '.touch-target': {
          minHeight: '44px',
          minWidth: '44px',
        },

        // Safe area utilities
        '.safe-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.safe-left': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.safe-right': {
          paddingRight: 'env(safe-area-inset-right)',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};

export default tailwindConfig;
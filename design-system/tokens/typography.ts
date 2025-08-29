/**
 * EchoinWhispr Design System - Typography Tokens
 *
 * This file defines the typography system for the EchoinWhispr design system.
 * Uses Inter font family as specified in UI/UX guidelines.
 */

export const typography = {
  // Font Family
  fontFamily: {
    primary: ['Inter', 'system-ui', 'sans-serif'] as string[],
    mono: ['JetBrains Mono', 'monospace'] as string[],
  },

  // Font Sizes (in rem for web, scaled for mobile)
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  // Font Weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },

  // Line Heights
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Text Styles (combinations of the above)
  textStyles: {
    // Headings
    h1: {
      fontSize: 'fontSize.4xl',
      fontWeight: 'fontWeight.bold',
      lineHeight: 'lineHeight.tight',
      letterSpacing: 'letterSpacing.tight',
    },
    h2: {
      fontSize: 'fontSize.3xl',
      fontWeight: 'fontWeight.semibold',
      lineHeight: 'lineHeight.tight',
      letterSpacing: 'letterSpacing.tight',
    },
    h3: {
      fontSize: 'fontSize.2xl',
      fontWeight: 'fontWeight.semibold',
      lineHeight: 'lineHeight.snug',
      letterSpacing: 'letterSpacing.normal',
    },
    h4: {
      fontSize: 'fontSize.xl',
      fontWeight: 'fontWeight.semibold',
      lineHeight: 'lineHeight.snug',
      letterSpacing: 'letterSpacing.normal',
    },
    h5: {
      fontSize: 'fontSize.lg',
      fontWeight: 'fontWeight.medium',
      lineHeight: 'lineHeight.normal',
      letterSpacing: 'letterSpacing.normal',
    },
    h6: {
      fontSize: 'fontSize.base',
      fontWeight: 'fontWeight.medium',
      lineHeight: 'lineHeight.normal',
      letterSpacing: 'letterSpacing.normal',
    },

    // Body Text
    body: {
      fontSize: 'fontSize.base',
      fontWeight: 'fontWeight.normal',
      lineHeight: 'lineHeight.relaxed',
      letterSpacing: 'letterSpacing.normal',
    },
    bodySmall: {
      fontSize: 'fontSize.sm',
      fontWeight: 'fontWeight.normal',
      lineHeight: 'lineHeight.relaxed',
      letterSpacing: 'letterSpacing.normal',
    },

    // UI Elements
    button: {
      fontSize: 'fontSize.sm',
      fontWeight: 'fontWeight.medium',
      lineHeight: 'lineHeight.none',
      letterSpacing: 'letterSpacing.normal',
    },
    caption: {
      fontSize: 'fontSize.xs',
      fontWeight: 'fontWeight.normal',
      lineHeight: 'lineHeight.normal',
      letterSpacing: 'letterSpacing.wide',
    },
    label: {
      fontSize: 'fontSize.sm',
      fontWeight: 'fontWeight.medium',
      lineHeight: 'lineHeight.normal',
      letterSpacing: 'letterSpacing.normal',
    },
  },
} as const;

// Type definitions
export type TypographyToken = keyof typeof typography;
export type FontSizeToken = keyof typeof typography.fontSize;
export type FontWeightToken = keyof typeof typography.fontWeight;
export type LineHeightToken = keyof typeof typography.lineHeight;
export type LetterSpacingToken = keyof typeof typography.letterSpacing;
export type TextStyleToken = keyof typeof typography.textStyles;

// Helper functions
export const getFontSize = (size: FontSizeToken) => typography.fontSize[size];
export const getFontWeight = (weight: FontWeightToken) => typography.fontWeight[weight];
export const getLineHeight = (height: LineHeightToken) => typography.lineHeight[height];
export const getLetterSpacing = (spacing: LetterSpacingToken) => typography.letterSpacing[spacing];
export const getTextStyle = (style: TextStyleToken) => typography.textStyles[style];
/**
 * EchoinWhispr Design System - Typography Tokens
 *
 * Premium typography system with Inter for body text and
 * Outfit for display headings. Optimized for dark mode readability.
 */

export const typography = {
  // Font Families
  fontFamily: {
    // Primary body font - clean and highly readable
    primary: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'] as string[],
    // Display font for headings - modern and impactful
    display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'] as string[],
    // Monospace font for code elements
    mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Consolas', 'monospace'] as string[],
  },

  // Font Sizes (in rem for scalability)
  fontSize: {
    '2xs': '0.625rem',   // 10px
    xs: '0.75rem',       // 12px
    sm: '0.875rem',      // 14px
    base: '1rem',        // 16px
    lg: '1.125rem',      // 18px
    xl: '1.25rem',       // 20px
    '2xl': '1.5rem',     // 24px
    '3xl': '1.875rem',   // 30px
    '4xl': '2.25rem',    // 36px
    '5xl': '3rem',       // 48px
    '6xl': '3.75rem',    // 60px
    '7xl': '4.5rem',     // 72px
    '8xl': '6rem',       // 96px
    '9xl': '8rem',       // 128px
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
    tight: '1.1',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '1.75',
    prose: '1.8',
  },

  // Letter Spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
    ultra: '0.2em',
  },

  // Text Styles (semantic combinations)
  textStyles: {
    // Display Headings (use Outfit font)
    display: {
      fontSize: '5xl',
      fontWeight: 'bold',
      lineHeight: 'tight',
      letterSpacing: 'tight',
      fontFamily: 'display',
    },
    displayLarge: {
      fontSize: '6xl',
      fontWeight: 'bold',
      lineHeight: 'none',
      letterSpacing: 'tight',
      fontFamily: 'display',
    },
    displayXL: {
      fontSize: '7xl',
      fontWeight: 'black',
      lineHeight: 'none',
      letterSpacing: 'tighter',
      fontFamily: 'display',
    },

    // Headings (use Outfit for h1-h3, Inter for h4-h6)
    h1: {
      fontSize: '4xl',
      fontWeight: 'bold',
      lineHeight: 'tight',
      letterSpacing: 'tight',
      fontFamily: 'display',
    },
    h2: {
      fontSize: '3xl',
      fontWeight: 'bold',
      lineHeight: 'snug',
      letterSpacing: 'tight',
      fontFamily: 'display',
    },
    h3: {
      fontSize: '2xl',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      letterSpacing: 'normal',
      fontFamily: 'display',
    },
    h4: {
      fontSize: 'xl',
      fontWeight: 'semibold',
      lineHeight: 'snug',
      letterSpacing: 'normal',
      fontFamily: 'primary',
    },
    h5: {
      fontSize: 'lg',
      fontWeight: 'medium',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      fontFamily: 'primary',
    },
    h6: {
      fontSize: 'base',
      fontWeight: 'medium',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      fontFamily: 'primary',
    },

    // Body Text
    body: {
      fontSize: 'base',
      fontWeight: 'normal',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      fontFamily: 'primary',
    },
    bodyLarge: {
      fontSize: 'lg',
      fontWeight: 'normal',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      fontFamily: 'primary',
    },
    bodySmall: {
      fontSize: 'sm',
      fontWeight: 'normal',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      fontFamily: 'primary',
    },

    // Lead paragraph (for intro text)
    lead: {
      fontSize: 'xl',
      fontWeight: 'normal',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      fontFamily: 'primary',
    },

    // Prose (for long-form content)
    prose: {
      fontSize: 'base',
      fontWeight: 'normal',
      lineHeight: 'prose',
      letterSpacing: 'normal',
      fontFamily: 'primary',
    },

    // UI Elements
    button: {
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: 'none',
      letterSpacing: 'wide',
      fontFamily: 'primary',
    },
    buttonLarge: {
      fontSize: 'base',
      fontWeight: 'semibold',
      lineHeight: 'none',
      letterSpacing: 'wide',
      fontFamily: 'primary',
    },
    caption: {
      fontSize: 'xs',
      fontWeight: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'wide',
      fontFamily: 'primary',
    },
    label: {
      fontSize: 'sm',
      fontWeight: 'medium',
      lineHeight: 'normal',
      letterSpacing: 'wide',
      fontFamily: 'primary',
    },
    overline: {
      fontSize: 'xs',
      fontWeight: 'semibold',
      lineHeight: 'normal',
      letterSpacing: 'widest',
      fontFamily: 'primary',
      textTransform: 'uppercase',
    },

    // Code & Technical
    code: {
      fontSize: 'sm',
      fontWeight: 'normal',
      lineHeight: 'normal',
      letterSpacing: 'normal',
      fontFamily: 'mono',
    },
    codeBlock: {
      fontSize: 'sm',
      fontWeight: 'normal',
      lineHeight: 'relaxed',
      letterSpacing: 'normal',
      fontFamily: 'mono',
    },

    // Decorative
    stat: {
      fontSize: '4xl',
      fontWeight: 'bold',
      lineHeight: 'none',
      letterSpacing: 'tight',
      fontFamily: 'display',
    },
    badge: {
      fontSize: '2xs',
      fontWeight: 'medium',
      lineHeight: 'none',
      letterSpacing: 'wide',
      fontFamily: 'primary',
    },
  },
} as const;

// Type definitions
export type TypographyToken = keyof typeof typography;
export type FontFamilyToken = keyof typeof typography.fontFamily;
export type FontSizeToken = keyof typeof typography.fontSize;
export type FontWeightToken = keyof typeof typography.fontWeight;
export type LineHeightToken = keyof typeof typography.lineHeight;
export type LetterSpacingToken = keyof typeof typography.letterSpacing;
export type TextStyleToken = keyof typeof typography.textStyles;

// Helper functions
export const getFontFamily = (family: FontFamilyToken) => typography.fontFamily[family].join(', ');
export const getFontSize = (size: FontSizeToken) => typography.fontSize[size];
export const getFontWeight = (weight: FontWeightToken) => typography.fontWeight[weight];
export const getLineHeight = (height: LineHeightToken) => typography.lineHeight[height];
export const getLetterSpacing = (spacing: LetterSpacingToken) => typography.letterSpacing[spacing];
export const getTextStyle = (style: TextStyleToken) => typography.textStyles[style];

// CSS class generators
export const textClass = (style: TextStyleToken): string => {
  const config = typography.textStyles[style];
  return `text-${config.fontSize} font-${config.fontWeight} leading-${config.lineHeight} tracking-${config.letterSpacing}`;
};

// Responsive font size helpers
export const responsiveFontSizes = {
  display: 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
  h1: 'text-3xl md:text-4xl lg:text-5xl',
  h2: 'text-2xl md:text-3xl lg:text-4xl',
  h3: 'text-xl md:text-2xl lg:text-3xl',
  h4: 'text-lg md:text-xl lg:text-2xl',
  body: 'text-sm md:text-base',
  lead: 'text-base md:text-lg lg:text-xl',
} as const;
/**
 * EchoinWhispr Design System - Spacing Tokens
 *
 * This file defines the spacing system for the EchoinWhispr design system.
 * Uses a consistent scale based on 4px increments.
 */

export const spacing = {
  // Base spacing scale (4px increments)
  0: '0rem',      // 0px
  0.5: '0.125rem', // 2px
  1: '0.25rem',   // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem',    // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem',   // 12px
  3.5: '0.875rem', // 14px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  18: '4.5rem',   // 72px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem',    // 384px
} as const;

// Semantic spacing tokens for common use cases
export const semanticSpacing = {
  // Component spacing
  component: {
    padding: {
      xs: spacing[2],  // 8px
      sm: spacing[3],  // 12px
      md: spacing[4],  // 16px
      lg: spacing[6],  // 24px
      xl: spacing[8],  // 32px
    },
    margin: {
      xs: spacing[1],  // 4px
      sm: spacing[2],  // 8px
      md: spacing[3],  // 12px
      lg: spacing[4],  // 16px
      xl: spacing[6],  // 24px
    },
    gap: {
      xs: spacing[1],  // 4px
      sm: spacing[2],  // 8px
      md: spacing[3],  // 12px
      lg: spacing[4],  // 16px
      xl: spacing[6],  // 24px
    },
  },

  // Layout spacing
  layout: {
    container: {
      padding: {
        mobile: spacing[4],   // 16px
        tablet: spacing[6],   // 24px
        desktop: spacing[8],  // 32px
      },
      maxWidth: {
        mobile: '100%',
        tablet: '768px',
        desktop: '1024px',
        wide: '1280px',
      },
    },
    section: {
      margin: {
        top: spacing[12],     // 48px
        bottom: spacing[12],  // 48px
      },
    },
  },

  // Typography spacing
  typography: {
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
    paragraph: {
      margin: {
        bottom: spacing[4],  // 16px
      },
    },
    heading: {
      margin: {
        bottom: spacing[3],  // 12px
      },
    },
  },

  // Interactive elements
  interactive: {
    touchTarget: {
      minSize: spacing[10],  // 40px (WCAG AA compliant)
    },
    focusRing: {
      width: spacing[0.5],   // 2px
      offset: spacing[1],    // 4px
    },
    borderRadius: {
      none: spacing[0],      // 0px
      sm: spacing[1],        // 4px
      md: spacing[2],        // 8px
      lg: spacing[3],        // 12px
      xl: spacing[4],        // 16px
      full: '9999px',        // Fully rounded
    },
  },

  // Elevation/Shadows
  elevation: {
    shadow: {
      offset: {
        x: spacing[0],       // 0px
        y: spacing[1],       // 4px
      },
      blur: {
        sm: spacing[2],      // 8px
        md: spacing[4],      // 16px
        lg: spacing[8],      // 32px
      },
      spread: spacing[0],    // 0px
    },
  },
} as const;

// Type definitions
export type SpacingToken = keyof typeof spacing;
export type SemanticSpacingCategory = keyof typeof semanticSpacing;

// Helper functions
export const getSpacing = (value: SpacingToken) => spacing[value];
export const getSemanticSpacing = (category: SemanticSpacingCategory) => semanticSpacing[category];

// Common spacing patterns
export const spacingPatterns = {
  // Card spacing
  card: {
    padding: semanticSpacing.component.padding.md,
    margin: semanticSpacing.component.margin.sm,
    borderRadius: semanticSpacing.interactive.borderRadius.md,
  },

  // Button spacing
  button: {
    padding: {
      horizontal: semanticSpacing.component.padding.md,
      vertical: semanticSpacing.component.padding.sm,
    },
    borderRadius: semanticSpacing.interactive.borderRadius.md,
  },

  // Input spacing
  input: {
    padding: {
      horizontal: semanticSpacing.component.padding.md,
      vertical: semanticSpacing.component.padding.sm,
    },
    borderRadius: semanticSpacing.interactive.borderRadius.sm,
  },

  // Modal/Dialog spacing
  modal: {
    padding: semanticSpacing.component.padding.lg,
    borderRadius: semanticSpacing.interactive.borderRadius.lg,
    margin: semanticSpacing.component.margin.lg,
  },
} as const;
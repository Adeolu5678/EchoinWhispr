/**
 * EchoinWhspr Design System - Components
 *
 * Export all design system components for easy importing.
 */

// Core component types (implementations are platform-specific)
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

// Re-export utilities
export * from '../utils';

// Re-export tokens for direct access (with specific naming to avoid conflicts)
export {
  colors as designTokens,
  typography as designTypography,
  spacing as designSpacing,
  getColor,
  getFontSize,
  getFontWeight,
  getTextStyle,
  getSpacing,
  semanticSpacing,
  spacingPatterns,
} from '../tokens';

// Component collections (types only - implementations are platform-specific)
// export const componentLibrary = {
//   // Button implementations are in platform-specific packages
// };
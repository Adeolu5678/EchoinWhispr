/**
 * EchoinWhspr Web - Button Component
 *
 * Web-specific Button component that extends the shared design system.
 * Uses HTML button elements with Tailwind CSS styling.
 */

import React from 'react';
import { ButtonProps } from '../../design-system/components/Button';
import { colors, spacing, typography } from '../../design-system/tokens';

const buttonVariants = {
  primary: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
    textColor: colors.text.inverse,
    hoverBackgroundColor: colors.primary[600],
    hoverBorderColor: colors.primary[600],
  },
  secondary: {
    backgroundColor: colors.neutral[100],
    borderColor: colors.neutral[300],
    textColor: colors.text.primary,
    hoverBackgroundColor: colors.neutral[200],
    hoverBorderColor: colors.neutral[400],
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.primary[500],
    textColor: colors.primary[500],
    hoverBackgroundColor: colors.primary[50],
    hoverBorderColor: colors.primary[600],
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    textColor: colors.primary[500],
    hoverBackgroundColor: colors.primary[50],
    hoverBorderColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.error[500],
    borderColor: colors.error[500],
    textColor: colors.text.inverse,
    hoverBackgroundColor: colors.error[600],
    hoverBorderColor: colors.error[600],
  },
};

const buttonSizes = {
  sm: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    fontSize: typography.fontSize.sm,
    minHeight: spacing[8],
  },
  md: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2.5],
    fontSize: typography.fontSize.sm,
    minHeight: spacing[10],
  },
  lg: {
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    fontSize: typography.fontSize.base,
    minHeight: spacing[12],
  },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const variantStyles = buttonVariants[variant as keyof typeof buttonVariants];
  const sizeStyles = buttonSizes[size as keyof typeof buttonSizes];

  const baseClasses = `
    inline-flex items-center justify-center
    border rounded-md
    font-medium
    transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  // Use static Tailwind classes instead of dynamic ones
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 focus:ring-blue-500';
      case 'secondary':
        return 'bg-gray-100 border-gray-300 text-gray-900 hover:bg-gray-200 hover:border-gray-400 focus:ring-gray-500';
      case 'outline':
        return 'bg-transparent border-blue-500 text-blue-500 hover:bg-blue-50 hover:border-blue-600 focus:ring-blue-500';
      case 'ghost':
        return 'bg-transparent border-transparent text-blue-500 hover:bg-blue-50 focus:ring-blue-500';
      case 'danger':
        return 'bg-red-500 border-red-500 text-white hover:bg-red-600 hover:border-red-600 focus:ring-red-500';
      default:
        return 'bg-blue-500 border-blue-500 text-white hover:bg-blue-600 hover:border-blue-600 focus:ring-blue-500';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 min-h-8 text-sm';
      case 'md':
        return 'px-4 py-2.5 min-h-10 text-sm';
      case 'lg':
        return 'px-6 py-3 min-h-12 text-base';
      default:
        return 'px-4 py-2.5 min-h-10 text-sm';
    }
  };

  const combinedClasses = `${baseClasses} ${getVariantClasses()} ${getSizeClasses()}`.trim();

  return (
    <button
      className={combinedClasses}
      onClick={onPress}
      disabled={disabled || loading}
      style={style}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span style={textStyle}>{children}</span>
    </button>
  );
};

export default Button;
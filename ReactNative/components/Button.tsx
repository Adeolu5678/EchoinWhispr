/**
 * EchoinWhspr React Native - Button Component
 *
 * React Native specific Button component using NativeWind.
 * Wraps the shared design system Button with React Native optimizations.
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { styled } from 'nativewind';
import { ButtonProps } from '../../design-system/components/Button';

// Styled components using NativeWind
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);
const StyledActivityIndicator = styled(ActivityIndicator);

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
  // React Native specific implementation
  const getVariantClasses = () => {
    const baseClasses = 'rounded-md border items-center justify-center';

    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-500 border-blue-500`;
      case 'secondary':
        return `${baseClasses} bg-gray-100 border-gray-300`;
      case 'outline':
        return `${baseClasses} bg-transparent border-blue-500`;
      case 'ghost':
        return `${baseClasses} bg-transparent border-transparent`;
      case 'danger':
        return `${baseClasses} bg-red-500 border-red-500`;
      default:
        return `${baseClasses} bg-blue-500 border-blue-500`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 min-h-8';
      case 'md':
        return 'px-4 py-2.5 min-h-10';
      case 'lg':
        return 'px-6 py-3 min-h-12';
      default:
        return 'px-4 py-2.5 min-h-10';
    }
  };

  const getTextClasses = () => {
    const baseClasses = 'text-center font-medium';

    switch (variant) {
      case 'primary':
      case 'danger':
        return `${baseClasses} text-white`;
      case 'secondary':
        return `${baseClasses} text-gray-900`;
      case 'outline':
      case 'ghost':
        return `${baseClasses} text-blue-500`;
      default:
        return `${baseClasses} text-white`;
    }
  };

  const buttonClasses = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${disabled ? 'opacity-50' : ''}
    ${fullWidth ? 'w-full' : ''}
  `.trim();

  const textClasses = `
    ${getTextClasses()}
    ${size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-base' : 'text-sm'}
  `.trim();

  return (
    <TouchableOpacity
      className={buttonClasses}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={style}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#0ea5e9'}
          className="mr-2"
        />
      )}
      <Text className={textClasses} style={textStyle}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
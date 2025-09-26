/**
 * EchoinWhspr React Native - Button Component
 *
 * React Native specific Button component.
 * Temporarily using StyleSheet until NativeWind is properly configured.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { ButtonProps } from '../../design-system/components/Button';

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
  const getButtonStyle = () => {
    const baseStyle = [
      styles.base,
      styles[variant],
      styles[size],
      disabled && styles.disabled,
      fullWidth && styles.fullWidth,
    ];

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.textBase, styles[size], styles[`${variant}Text`]];

    return baseStyle;
  };

  const getLoadingColor = () => {
    return variant === 'primary' || variant === 'danger'
      ? '#ffffff'
      : '#0ea5e9';
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={getLoadingColor()}
          style={styles.loadingIndicator}
        />
      )}
      <Text style={[getTextStyle(), textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  // Variants
  primary: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  secondary: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#3b82f6',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  // Sizes
  sm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  lg: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    minHeight: 48,
  },
  // States
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },
  // Text styles
  textBase: {
    textAlign: 'center',
    fontWeight: '500',
  },
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#111827',
  },
  outlineText: {
    color: '#3b82f6',
  },
  ghostText: {
    color: '#3b82f6',
  },
  dangerText: {
    color: '#ffffff',
  },
  loadingIndicator: {
    marginRight: 8,
  },
});

export default Button;

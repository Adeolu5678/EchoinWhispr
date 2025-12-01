'use client';

import React from 'react';
import Image from 'next/image';
import { Card } from './card';
import { AlertCircle, ImageIcon } from 'lucide-react';

/**
 * Props for the ImagePreview component
 */
export interface ImagePreviewProps {
  /** The URL of the image to display */
  src: string;
  /** Alternative text for the image */
  alt?: string;
  /** Size variant for the image display */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Aspect ratio variant */
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'auto';
  /** Whether to show a loading state */
  loading?: boolean;
  /** Error message to display if image fails to load */
  error?: string | null;
  /** Callback when image loads successfully */
  onLoad?: () => void;
  /** Callback when image fails to load */
  onError?: () => void;
  /** Custom className for the container */
  className?: string;
  /** Whether the image should be rounded */
  rounded?: boolean;
  /** Whether to show a border */
  bordered?: boolean;
  /** Custom styles for the image container */
  containerStyle?: React.CSSProperties;
}

/**
 * Image preview component with loading states, error handling, and responsive sizing.
 * Uses Next.js Image component for optimization and performance.
 */
export function ImagePreview({
  src,
  alt = 'Image preview',
  size = 'md',
  aspectRatio = 'auto',
  loading = false,
  error = null,
  onLoad,
  onError,
  className = '',
  rounded = false,
  bordered = true,
  containerStyle,
}: ImagePreviewProps) {
  // Size configurations
  const sizeClasses = {
    xs: 'w-12 h-12',
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  // Aspect ratio configurations
  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: '',
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card className={`p-4 ${className}`} style={containerStyle}>
        <div
          className={`
            ${sizeClasses[size]}
            ${aspectRatioClasses[aspectRatio]}
            bg-muted animate-pulse rounded-lg flex items-center justify-center
            ${rounded ? 'rounded-full' : ''}
            ${bordered ? 'border border-muted-foreground/20' : ''}
          `}
        >
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
        </div>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className={`p-4 ${className}`} style={containerStyle}>
        <div
          className={`
            ${sizeClasses[size]}
            ${aspectRatioClasses[aspectRatio]}
            bg-destructive/10 border border-destructive/20 rounded-lg flex flex-col items-center justify-center gap-2
            ${rounded ? 'rounded-full' : ''}
          `}
        >
          <AlertCircle className="w-6 h-6 text-destructive" />
          <span className="text-xs text-destructive text-center px-2">
            {error}
          </span>
        </div>
      </Card>
    );
  }

  // Normal image display
  return (
    <Card className={`p-4 ${className}`} style={containerStyle}>
      <div
        className={`
          relative overflow-hidden
          ${sizeClasses[size]}
          ${aspectRatioClasses[aspectRatio]}
          ${rounded ? 'rounded-full' : 'rounded-lg'}
          ${bordered ? 'border border-muted-foreground/20' : ''}
        `}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onLoad={onLoad}
          onError={onError}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={size === 'xl'}
        />
      </div>
    </Card>
  );
}

/**
 * Avatar variant of ImagePreview - optimized for profile pictures
 */
export interface AvatarPreviewProps extends Omit<ImagePreviewProps, 'aspectRatio' | 'size'> {
  /** Size variant for avatar */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarPreview({
  size = 'md',
  ...props
}: AvatarPreviewProps) {
  const avatarSizeClasses = {
    xs: 'w-8 h-8',
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <ImagePreview
      {...props}
      size={size}
      aspectRatio="square"
      rounded={true}
      bordered={false}
      className={`inline-block ${avatarSizeClasses[size]}`}
    />
  );
}
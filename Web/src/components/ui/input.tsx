import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional icon to display on the left */
  leftIcon?: React.ReactNode;
  /** Optional icon to display on the right */
  rightIcon?: React.ReactNode;
  /** Error state */
  error?: boolean;
}

/**
 * Premium Input component with glass effect styling.
 * 
 * Features:
 * - Glass morphism background
 * - Glow focus effect
 * - Optional left/right icons
 * - Error state styling
 * - Smooth transitions
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, leftIcon, rightIcon, error, ...props }, ref) => {
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon;

    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            // Base styles
            'flex h-11 w-full rounded-lg px-4 py-3 text-sm',
            // Glass effect
            'bg-white/5 backdrop-blur-sm',
            // Border styling
            'border border-white/10',
            // Text and placeholder
            'text-foreground placeholder:text-muted-foreground/60',
            // Transitions
            'transition-all duration-200',
            // Focus states with glow
            'focus:border-primary/50 focus:bg-white/8 focus:outline-none',
            'focus:ring-2 focus:ring-primary/20 focus:shadow-glow-sm',
            // Disabled state
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted/20',
            // File input styles
            'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
            // Icon padding adjustments
            hasLeftIcon && 'pl-10',
            hasRightIcon && 'pr-10',
            // Error state
            error && 'border-destructive/50 focus:border-destructive focus:ring-destructive/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };

import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Error state */
  error?: boolean;
}

/**
 * Premium Textarea component with glass effect styling.
 * 
 * Features:
 * - Glass morphism background
 * - Glow focus effect
 * - Error state styling
 * - Smooth transitions
 * - Auto-resize support via CSS
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Base styles
          'flex min-h-[120px] w-full rounded-lg px-4 py-3 text-sm resize-none',
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
          // Error state
          error && 'border-destructive/50 focus:border-destructive focus:ring-destructive/20',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };

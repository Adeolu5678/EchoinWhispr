import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        // Default solid primary
        default:
          'bg-primary/90 text-primary-foreground border border-primary/20 hover:bg-primary',
        // Secondary subtle
        secondary:
          'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80',
        // Destructive for errors/warnings
        destructive:
          'bg-destructive/90 text-destructive-foreground border border-destructive/20 hover:bg-destructive',
        // Success for positive states
        success:
          'bg-success/90 text-success-foreground border border-success/20 hover:bg-success',
        // Warning for caution
        warning:
          'bg-warning/90 text-warning-foreground border border-warning/20 hover:bg-warning',
        // Info
        info:
          'bg-info/90 text-info-foreground border border-info/20 hover:bg-info',
        // Outline - just border
        outline:
          'border border-border text-foreground hover:bg-accent/10 hover:border-primary/50',
        // Glass - frosted effect
        glass:
          'glass border-border/50 text-foreground hover:bg-accent/10',
        // Gradient - premium look
        gradient:
          'gradient-animated text-white border-0 shadow-glow-sm',
        // Accent - fuchsia accent color
        accent:
          'bg-accent/90 text-accent-foreground border border-accent/20 hover:bg-accent',
        // Glow - with subtle glow effect
        glow:
          'bg-primary/20 text-primary border border-primary/30 shadow-glow-sm hover:shadow-glow',
        // Muted - very subtle
        muted:
          'bg-muted text-muted-foreground border border-transparent',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10px]',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional icon to display before text */
  icon?: React.ReactNode;
  /** Optional dot indicator (replaces icon) */
  dot?: boolean;
  /** Dot color - only used when dot is true */
  dotColor?: string;
}

/**
 * Premium Badge component for displaying status, count, or category information.
 * 
 * Features:
 * - Multiple variants including glass, gradient, and glow effects
 * - Optional icon or dot indicator
 * - Size options
 * 
 * @param className - Additional CSS classes
 * @param variant - Visual variant of the badge
 * @param size - Size of the badge
 * @param icon - Optional icon element
 * @param dot - Show a dot indicator
 * @param dotColor - Custom dot color
 * @param children - Content to display inside the badge
 */
function Badge({ 
  className, 
  variant, 
  size,
  icon, 
  dot, 
  dotColor = 'bg-current',
  children,
  ...props 
}: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && (
        <span 
          className={cn(
            'w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse',
            dotColor
          )} 
        />
      )}
      {!dot && icon && (
        <span className="mr-1 -ml-0.5">{icon}</span>
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
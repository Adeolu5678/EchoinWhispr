import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary - Solid purple with glow
        default:
          'bg-primary text-primary-foreground shadow-button hover:bg-primary/90 hover:shadow-button-hover active:scale-[0.98]',
        // Gradient - Animated gradient background
        gradient:
          'gradient-animated text-white shadow-glow hover:shadow-glow-lg active:scale-[0.98]',
        // Glow - Subtle with pulsing glow effect
        glow: 'bg-primary text-white shadow-glow pulse-glow hover:shadow-glow-lg',
        // Glass - Frosted glass effect
        glass:
          'glass text-foreground hover:bg-white/10 hover:border-white/15 active:scale-[0.98]',
        // Destructive - Red for dangerous actions
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm hover:shadow-md active:scale-[0.98]',
        // Outline - Bordered button
        outline:
          'border border-input bg-transparent hover:bg-accent/10 hover:text-accent-foreground hover:border-primary/50 active:scale-[0.98]',
        // Secondary - Subtle background
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',
        // Ghost - No background until hover
        ghost:
          'hover:bg-accent/10 hover:text-accent-foreground active:scale-[0.98]',
        // Link - Looks like a link
        link: 'text-primary underline-offset-4 hover:underline',
        // Success - Green for positive actions
        success:
          'bg-success text-success-foreground hover:bg-success/90 shadow-sm hover:shadow-md active:scale-[0.98]',
        // Premium - Special accent styling
        premium:
          'bg-gradient-to-r from-accent-500 to-primary-500 text-white shadow-glow-accent hover:shadow-glow-accent-lg active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8 text-base',
        xl: 'h-12 rounded-xl px-10 text-base font-semibold',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

/**
 * Animated loading spinner with glow effect
 */
const LoadingSpinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin h-4 w-4', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
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
);

/**
 * Premium Button component with multiple variants and sizes.
 * 
 * Features:
 * - Multiple visual variants including gradient, glow, and glass effects
 * - Loading state with animated spinner
 * - Smooth hover and active animations
 * - Full accessibility support
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <LoadingSpinner className="mr-2" />}
        {children}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };

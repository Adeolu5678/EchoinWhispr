'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show only icon without text */
  iconOnly?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to wrap in a Link to home */
  asLink?: boolean;
}

const sizeConfig = {
  sm: { height: 48, width: 48, iconSize: 40 },
  md: { height: 56, width: 56, iconSize: 48 },
  lg: { height: 72, width: 72, iconSize: 64 },
};

/**
 * EchoinWhispr Logo component
 * 
 * Displays the app logo with configurable size and link behavior.
 */
export function Logo({ 
  size = 'md', 
  iconOnly = false, 
  className,
  asLink = true 
}: LogoProps) {
  const config = sizeConfig[size];
  
  const logoContent = (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative">
        <Image
          src="/logo-icon.png"
          alt="EchoinWhispr"
          width={config.width}
          height={config.height}
          className="object-contain"
          priority
        />
      </div>
      {!iconOnly && (
        <span className={cn(
          'font-display font-bold tracking-tight',
          size === 'sm' && 'text-lg',
          size === 'md' && 'text-xl',
          size === 'lg' && 'text-2xl'
        )}>
          EchoinWhispr
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="group">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}

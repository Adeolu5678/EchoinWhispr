'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  className?: string;
  asLink?: boolean;
}

const sizeConfig = {
  sm: { height: 32, width: 32 },
  md: { height: 40, width: 40 },
  lg: { height: 48, width: 48 },
};

const blurDataUrl = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjOEI1Q0Y2Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNjM2NkYxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGNpcmNsZSBjeD0iMzIiIGN5PSIzMiIgcj0iMzAiIGZpbGw9InVybCgjZykiLz48L3N2Zz4=';

export function Logo({ 
  size = 'md', 
  iconOnly = false, 
  className,
  asLink = true 
}: LogoProps) {
  const config = sizeConfig[size];
  
  const logoContent = (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="relative shrink-0">
        <Image
          src="/logo-icon.svg"
          alt="EchoinWhispr"
          width={config.width}
          height={config.height}
          className="object-contain"
          priority
          placeholder="blur"
          blurDataURL={blurDataUrl}
          sizes={`${config.width}px`}
        />
      </div>
      {!iconOnly && (
        <span className={cn(
          'font-display font-bold tracking-tight bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent',
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

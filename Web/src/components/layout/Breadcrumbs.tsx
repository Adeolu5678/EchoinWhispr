'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

export function Breadcrumbs() {
  const pathname = usePathname();
  
  // Don't show on dashboard or home
  if (pathname === '/' || pathname === '/dashboard') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center text-sm text-neutral-400 mb-6">
      <Link href="/dashboard" className="hover:text-white transition-colors">
        <Home className="w-4 h-4" />
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        return (
          <Fragment key={href}>
            <ChevronRight className="w-4 h-4 mx-2 text-neutral-600" />
            {isLast ? (
              <span className="text-white font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}

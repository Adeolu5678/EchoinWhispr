'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { Shield, MessageSquare, Users, ChevronRight, Home } from 'lucide-react';
import { useAdminData } from '@/features/admin/hooks';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter(); 
  const { isSignedIn, isLoaded } = useAuth();
  const { isAdmin, isSuperAdmin, isLoading: isAdminLoading } = useAdminData();

  const isLoading = !isLoaded || isAdminLoading;

  // Effect to handle redirection once loading is complete
  useEffect(() => {
    if (!isLoading) {
      if (!isSignedIn) {
        router.push('/sign-in');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [isLoading, isSignedIn, isLoaded, isAdmin, router]);

  // Show loading state while determining access
  if (isLoading || (!isSignedIn || !isAdmin)) {
    return (
      <div className="min-h-[100dvh] pt-20 pb-10 px-4 md:px-8 lg:px-12 flex justify-center">
        <div className="w-full max-w-6xl animate-pulse">
          <div className="h-16 bg-primary/10 rounded-xl mb-6" />
          <div className="h-96 bg-card/50 rounded-xl" />
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/whispers', label: 'Whisper Monitor', icon: MessageSquare },
    ...(isSuperAdmin
      ? [{ href: '/admin/requests', label: 'Admin Requests', icon: Users }]
      : []),
  ];

  return (
    <div className="min-h-[100dvh] pt-20 pb-10 px-4 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="glass rounded-2xl p-6 border border-white/10 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-2.5 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Admin Control Center</h1>
                <p className="text-muted-foreground text-sm">
                  {isSuperAdmin ? 'Super Admin' : 'Admin'} Dashboard
                </p>
              </div>
            </div>

            {/* Breadcrumb nav */}
            <nav className="flex items-center gap-1">
              {navItems.map((item, index) => (
                <div key={item.href} className="flex items-center">
                  {index > 0 && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground mx-1" />
                  )}
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </header>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}

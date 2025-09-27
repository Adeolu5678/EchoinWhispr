'use client';

import { SignUp } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { UsernamePickerModal } from '@/features/authentication/components/UsernamePickerModal';

export const dynamic = 'force-dynamic';

export default function SignUpPage(): JSX.Element {
  const [showUsernameModal, setShowUsernameModal] = useState(false);

  // Debug logging for authentication flow
  useEffect(() => {
    console.log('🔍 [DEBUG] SignUpPage: Component mounted');

    // Log current URL and search params
    console.log('🔍 [DEBUG] SignUpPage: Current URL:', window.location.href);
    console.log(
      '🔍 [DEBUG] SignUpPage: Search params:',
      window.location.search
    );

    // Check if we're coming from a redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('redirect_url')) {
      console.log(
        '🔍 [DEBUG] SignUpPage: Redirect URL detected:',
        urlParams.get('redirect_url')
      );
    }

    return () => {
      console.log('🔍 [DEBUG] SignUpPage: Component unmounting');
    };
  }, []);

  // Debug logging for username modal state
  useEffect(() => {
    console.log(
      '🔍 [DEBUG] SignUpPage: Username modal state changed:',
      showUsernameModal
    );
  }, [showUsernameModal]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        redirectUrl="/"
        appearance={{
          elements: {
            formButtonPrimary:
              'bg-blue-600 text-white hover:bg-blue-700',
            card: 'shadow-lg',
            headerTitle: 'text-2xl font-bold',
            headerSubtitle: 'text-muted-foreground',
          },
        }}
        afterSignInUrl="/"
      />
      <UsernamePickerModal
        isOpen={showUsernameModal}
        onClose={() => {
          console.log('🔍 [DEBUG] SignUpPage: Username modal closed');
          setShowUsernameModal(false);
        }}
      />
    </main>
  );
}

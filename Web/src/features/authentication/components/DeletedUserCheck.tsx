'use client';

import { useQuery } from 'convex/react';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/convex';

export function DeletedUserCheck() {
  const { isSignedIn, signOut } = useAuth();
  const router = useRouter();
  const isDeleted = useQuery(api.users.isCurrentUserDeleted);
  const hasHandledDeletion = useRef(false);

  useEffect(() => {
    if (isDeleted === true && !hasHandledDeletion.current) {
      hasHandledDeletion.current = true;
      signOut()
        .then(() => {
          router.push('/account-deleted');
        })
        .catch((error) => {
          console.error('Sign out failed:', error);
        });
    }
  }, [isDeleted, signOut, router]);

  if (!isSignedIn || isDeleted === undefined) {
    return null;
  }

  return null;
}

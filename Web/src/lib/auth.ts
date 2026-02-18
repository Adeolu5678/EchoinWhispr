'use client';

import { useAuth, useSession } from '@clerk/nextjs';
import { useConvexAuth } from 'convex/react';
import { useToast } from '@/hooks/use-toast';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SESSION_EXPIRY_WARNING_THRESHOLD_MS = 5 * 60 * 1000;
const SESSION_CHECK_INTERVAL_MS = 60 * 1000;

export interface UseSessionExpiryOptions {
  warningThresholdMs?: number;
  checkIntervalMs?: number;
  onSessionExpired?: () => void;
}

export interface UseSessionExpiryReturn {
  isSessionExpiringSoon: boolean;
  timeUntilExpiry: number | null;
  extendSession: () => Promise<void>;
  dismissWarning: () => void;
  isWarningDismissed: boolean;
}

export function useSessionExpiry(
  options: UseSessionExpiryOptions = {}
): UseSessionExpiryReturn {
  const {
    warningThresholdMs = SESSION_EXPIRY_WARNING_THRESHOLD_MS,
    checkIntervalMs = SESSION_CHECK_INTERVAL_MS,
    onSessionExpired,
  } = options;

  const { isSignedIn, isLoaded } = useAuth();
  const { session, isLoaded: isSessionLoaded } = useSession();
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const { toast } = useToast();

  const [isSessionExpiringSoon, setIsSessionExpiringSoon] = useState(false);
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null);
  const [isWarningDismissed, setIsWarningDismissed] = useState(false);

  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasShownWarningRef = useRef(false);

  const checkSessionExpiry = useCallback(async () => {
    if (!isSignedIn || !isLoaded || !isConvexAuthenticated || !session) {
      return;
    }

    try {
      const expiresAt = session.expireAt?.getTime?.() ?? null;
      if (!expiresAt) {
        return;
      }

      const now = Date.now();
      const timeRemaining = expiresAt - now;
      setTimeUntilExpiry(timeRemaining);

      if (timeRemaining <= warningThresholdMs && timeRemaining > 0) {
        setIsSessionExpiringSoon(true);

        if (!hasShownWarningRef.current && !isWarningDismissed) {
          hasShownWarningRef.current = true;
          toast({
            title: 'Session Expiring Soon',
            description: `Your session will expire in ${Math.ceil(timeRemaining / 60000)} minutes. Consider saving your work.`,
            variant: 'default',
          });
        }
      } else {
        setIsSessionExpiringSoon(false);
        hasShownWarningRef.current = false;
      }

      if (timeRemaining <= 0 && onSessionExpired) {
        onSessionExpired();
      }
    } catch (error) {
      console.error('Error checking session expiry:', error);
    }
  }, [
    isSignedIn,
    isLoaded,
    isConvexAuthenticated,
    session,
    warningThresholdMs,
    isWarningDismissed,
    toast,
    onSessionExpired,
  ]);

  const extendSession = useCallback(async () => {
    if (!session) return;

    try {
      await session.touch?.();
      setIsSessionExpiringSoon(false);
      setIsWarningDismissed(false);
      hasShownWarningRef.current = false;
      toast({
        title: 'Session Extended',
        description: 'Your session has been extended.',
      });
    } catch (error) {
      console.error('Error extending session:', error);
      toast({
        title: 'Error',
        description: 'Failed to extend session. Please try again.',
        variant: 'destructive',
      });
    }
  }, [session, toast]);

  const dismissWarning = useCallback(() => {
    setIsWarningDismissed(true);
  }, []);

  useEffect(() => {
    if (!isSignedIn || !isLoaded || !isConvexAuthenticated || !isSessionLoaded) {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
      return;
    }

    checkSessionExpiry();

    checkIntervalRef.current = setInterval(checkSessionExpiry, checkIntervalMs);

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [isSignedIn, isLoaded, isConvexAuthenticated, isSessionLoaded, checkSessionExpiry, checkIntervalMs]);

  return {
    isSessionExpiringSoon,
    timeUntilExpiry,
    extendSession,
    dismissWarning,
    isWarningDismissed,
  };
}

export interface UseSignOutOptions {
  redirectUrl?: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export interface UseSignOutReturn {
  signOut: () => Promise<void>;
  isSigningOut: boolean;
}

export function useSignOut(options: UseSignOutOptions = {}): UseSignOutReturn {
  const { redirectUrl = '/', onSuccess, onError } = options;
  const { signOut: clerkSignOut } = useAuth();
  const { isAuthenticated: isConvexAuthenticated } = useConvexAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const signOut = useCallback(async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await clerkSignOut();

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });

      onSuccess?.();

      if (redirectUrl) {
        router.push(redirectUrl);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Sign out failed');
      console.error('Error signing out:', err);

      toast({
        title: 'Sign out failed',
        description: 'There was an error signing out. Please try again.',
        variant: 'destructive',
      });

      onError?.(err);
    } finally {
      setIsSigningOut(false);
    }
  }, [
    clerkSignOut,
    isSigningOut,
    redirectUrl,
    router,
    toast,
    onSuccess,
    onError,
  ]);

  return {
    signOut,
    isSigningOut,
  };
}

export interface UseSessionExpiryRedirectOptions {
  redirectPath?: string;
  clearParamOnRedirect?: boolean;
}

export function useSessionExpiryRedirect(
  options: UseSessionExpiryRedirectOptions = {}
): void {
  const {
    redirectPath = '/sign-in',
    clearParamOnRedirect = true,
  } = options;

  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    if (hasHandledRef.current) return;

    const sessionExpired = searchParams.get('session_expired');

    if (sessionExpired === 'true') {
      hasHandledRef.current = true;

      toast({
        title: 'Session Expired',
        description: 'Your session has expired. Please sign in again to continue.',
        variant: 'default',
      });

      if (clearParamOnRedirect) {
        const currentPath = window.location.pathname;
        router.replace(currentPath);
      }

      router.push(`${redirectPath}?reason=session_expired`);
    }
  }, [searchParams, redirectPath, clearParamOnRedirect, router, toast]);
}

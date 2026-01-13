'use client';

import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';

/**
 * SSO Callback page for handling OAuth redirects (Google, GitHub, etc.)
 * This catches the callback from OAuth providers and completes the sign-in flow.
 */
export default function SSOCallback() {
  return <AuthenticateWithRedirectCallback />;
}

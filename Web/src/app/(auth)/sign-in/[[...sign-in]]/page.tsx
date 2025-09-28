'use client';

import { SignIn } from '@clerk/nextjs';

export const dynamic = 'force-dynamic';

/**
 * Render the sign-in page UI using Clerk's SignIn component with app-specific routing and styles.
 *
 * @returns A JSX element containing a centered Clerk SignIn component configured for path routing at "/sign-in", a sign-up link at "/sign-up", a post-auth redirect to "/", and tailored appearance classes for the form button, card, header title, and header subtitle.
 */
export default function SignInPage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
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
      />
    </main>
  );
}

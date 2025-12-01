'use client';

import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const dynamic = 'force-dynamic';

export default function SignUpPage(): JSX.Element {
  return (
    <SignUp
      routing="path"
      path="/sign-up"
      signInUrl="/sign-in"
      redirectUrl="/"
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary/90 text-white',
          card: 'bg-transparent shadow-none',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-secondary/50 border-border text-foreground',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
      }}
      afterSignInUrl="/"
    />
  );
}

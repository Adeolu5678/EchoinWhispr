'use client';

import { SignIn } from '@clerk/nextjs';
import { dark } from '@clerk/themes';

export const dynamic = 'force-dynamic';

export default function SignInPage(): JSX.Element {
  return (
    <SignIn
      routing="path"
      path="/sign-in"
      signUpUrl="/sign-up"
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
    />
  );
}

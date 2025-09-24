'use client'

import { SignIn } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

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
            formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
            card: 'shadow-lg',
            headerTitle: 'text-2xl font-bold',
            headerSubtitle: 'text-muted-foreground',
          },
        }}
      />
    </main>
  )
}
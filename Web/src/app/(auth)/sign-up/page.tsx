'use client'

import { SignUp } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

export default function SignUpPage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
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
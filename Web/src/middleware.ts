import { authMiddleware } from '@clerk/nextjs/server'

// Define protected routes that require authentication
export default authMiddleware({
export default authMiddleware({
  publicRoutes: ['/', '/sign-in(.*)', '/sign-up(.*)'],
  // All other routes are protected by default
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
import { authMiddleware } from '@clerk/nextjs/server';

/**
 * Middleware configuration for route protection and authentication
 * Protects main application routes while keeping public routes accessible
 */
export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    '/',
    '/sign-in(.*)',
    '/sign-up(.*)',
    '/api/webhooks/(.*)',
    '/api/test-env(.*)',
    '/test-clerk(.*)',
    '/test-user-creation(.*)'
  ],
  // Routes to ignore (static files, assets, etc.)
  ignoredRoutes: [
    '/_next/static/(.*)',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml'
  ],
  // Custom redirect behavior
  afterAuth(auth, req) {
    // Protected routes that require authentication
    const protectedRoutes = ['/', '/compose', '/inbox'];

    // If user is not authenticated and trying to access protected routes
    if (!auth.userId && protectedRoutes.includes(req.nextUrl.pathname)) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirect_url', req.nextUrl.pathname);
      return Response.redirect(signInUrl);
    }

    // If user is authenticated and trying to access auth pages, redirect to main app
    if (auth.userId && (req.nextUrl.pathname.startsWith('/sign-in') || req.nextUrl.pathname.startsWith('/sign-up'))) {
      return Response.redirect(new URL('/', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
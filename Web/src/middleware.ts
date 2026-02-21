import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/compose(.*)',
  '/inbox(.*)',
  '/friends(.*)',
  '/profile(.*)',
  '/settings(.*)',
  '/whispers(.*)',
  '/conversations(.*)',
  '/discover(.*)',
  '/chambers(.*)',
  '/skills(.*)',
  '/insights(.*)',
  '/admin(.*)',
  '/notifications(.*)',
]);

const isTestRoute = createRouteMatcher(['/test-user-creation(.*)', '/test-clerk(.*)']);

const isAuthRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isTestRoute(req) && process.env.NODE_ENV === 'production') {
    return Response.redirect(new URL('/', req.url));
  }

  const { userId } = await auth();

  if (isAuthRoute(req) && userId) {
    return Response.redirect(new URL('/', req.url));
  }

  if (isProtectedRoute(req)) await auth.protect();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};

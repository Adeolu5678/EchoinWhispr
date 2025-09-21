/**
 * Authentication configuration for Convex
 *
 * This file configures Convex to work with Clerk authentication.
 * It tells Convex how to validate Clerk JWT tokens and extract user information.
 */

export default {
  // Configure Convex to use Clerk for authentication
  providers: [
    {
      domain: "https://youthful-sandpiper-909.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],

  // Generate Convex auth tokens for Clerk users
  generateCommonJSApi: true,
};
/**
 * Authentication configuration for Convex
 *
 * This file configures Convex to work with Clerk authentication.
 * It tells Convex how to validate Clerk JWT tokens and extract user information.
 *
 * Environment variables are used instead of hardcoded values for security and flexibility.
 */

import type { Auth } from "convex/server";

/**
 * Validates that required environment variables are set and normalizes the domain
 */
function validateEnvironmentVariables(): { normalizedDomain: string } {
  const clerkJwtIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;

  if (!clerkJwtIssuerDomain) {
    throw new Error('CLERK_JWT_ISSUER_DOMAIN environment variable is not set');
  }

  if (!convexApplicationId) {
    throw new Error('CONVEX_APPLICATION_ID environment variable is not set');
  }

  // Validate and normalize domain format
  try {
    const url = new URL(clerkJwtIssuerDomain);
    if (url.protocol !== 'https:') {
      throw new Error('CLERK_JWT_ISSUER_DOMAIN must use HTTPS protocol');
    }
    // Return normalized domain (origin only, no path or trailing slash)
    const normalizedDomain = `${url.protocol}//${url.hostname}${url.port ? `:${url.port}` : ''}`;
    return { normalizedDomain };
  } catch (error) {
    throw new Error(`CLERK_JWT_ISSUER_DOMAIN is not a valid URL: ${clerkJwtIssuerDomain}`);
  }
}

const authConfig = {
  // Configure Convex to use Clerk for authentication
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
};

export default authConfig;
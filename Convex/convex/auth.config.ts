/**
 * Authentication configuration for Convex
 *
 * This file configures Convex to work with Clerk authentication.
 * It tells Convex how to validate Clerk JWT tokens and extract user information.
 *
 * Environment variables are used instead of hardcoded values for security and flexibility.
 */

import type { AuthConfig } from "convex/server";

/**
 * Validates that required environment variables are set
 */
function validateEnvironmentVariables(): void {
  const clerkJwtIssuerDomain = process.env.CLERK_JWT_ISSUER_DOMAIN;
  const convexApplicationId = process.env.CONVEX_APPLICATION_ID;

  if (!clerkJwtIssuerDomain) {
    throw new Error('CLERK_JWT_ISSUER_DOMAIN environment variable is not set');
  }

  if (!convexApplicationId) {
    throw new Error('CONVEX_APPLICATION_ID environment variable is not set');
  }

  // Validate domain format
  try {
    const url = new URL(clerkJwtIssuerDomain);
    if (!url.protocol.startsWith('https')) {
      throw new Error('CLERK_JWT_ISSUER_DOMAIN must use HTTPS protocol');
    }
  } catch (error) {
    throw new Error(`CLERK_JWT_ISSUER_DOMAIN is not a valid URL: ${clerkJwtIssuerDomain}`);
  }
}

const authConfig: AuthConfig = {
  // Configure Convex to use Clerk for authentication
  providers: [
    {
      domain: process.env.CLERK_FRONTEND_API_URL!,
      applicationID: "convex",
    },
  ],

  // Generate Convex auth tokens for Clerk users
  generateCommonJSApi: true,
};

// Validate environment variables at module load time
validateEnvironmentVariables();

export default authConfig;
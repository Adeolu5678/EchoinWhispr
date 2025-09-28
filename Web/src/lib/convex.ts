import { ConvexReactClient } from 'convex/react';
import { api } from '../../../Convex/convex/_generated/api';

/**
 * Validate that NEXT_PUBLIC_CONVEX_URL is set and is an absolute HTTP or HTTPS URL.
 *
 * @returns The Convex URL string read from `NEXT_PUBLIC_CONVEX_URL`.
 * @throws Error if `NEXT_PUBLIC_CONVEX_URL` is not set.
 * @throws Error if `NEXT_PUBLIC_CONVEX_URL` is not an absolute URL starting with `http://` or `https://`.
 */
function validateConvexUrl(): string {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    const error = new Error(
      'NEXT_PUBLIC_CONVEX_URL environment variable is not set'
    );
    throw error;
  }

  try {
    const url = new URL(convexUrl);
    const isValidProtocol =
      url.protocol === 'http:' || url.protocol === 'https:';

    if (!isValidProtocol) {
      const error = new Error(
        'NEXT_PUBLIC_CONVEX_URL must be an absolute URL starting with http:// or https://'
      );
      throw error;
    }

    return convexUrl;
  } catch (error) {
    const errorMessage = `NEXT_PUBLIC_CONVEX_URL is not a valid absolute URL: ${convexUrl}`;
    throw new Error(errorMessage);
  }
}

/**
 * Create a ConvexReactClient configured from the NEXT_PUBLIC_CONVEX_URL environment variable.
 *
 * @returns The constructed ConvexReactClient instance.
 * @throws Rethrows the original error if client creation fails; an error is logged to the console before rethrowing.
 */
function createConvexClient(): ConvexReactClient {
  try {
    const convexUrl = validateConvexUrl();
    const client = new ConvexReactClient(convexUrl);
    return client;
  } catch (error) {
    console.error('Failed to create Convex client:', error);
    throw error;
  }
}

const convex = createConvexClient();

export default convex;
export { api };

import { ConvexReactClient } from 'convex/react';

/**
 * Ensure the EXPO_PUBLIC_CONVEX_URL environment variable is set to an absolute HTTP(S) URL.
 *
 * @returns The validated value of `EXPO_PUBLIC_CONVEX_URL`.
 * @throws Error if `EXPO_PUBLIC_CONVEX_URL` is not set.
 * @throws Error if `EXPO_PUBLIC_CONVEX_URL` is not an absolute URL starting with `http://` or `https://`.
 */
function validateConvexUrl(): string {
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

  if (!convexUrl) {
    throw new Error('EXPO_PUBLIC_CONVEX_URL environment variable is not set');
  }

  try {
    const url = new URL(convexUrl);
    if (!url.protocol.startsWith('http')) {
      throw new Error(
        'EXPO_PUBLIC_CONVEX_URL must be an absolute URL starting with http:// or https://',
      );
    }
    return convexUrl;
  } catch (error) {
    throw new Error(
      `EXPO_PUBLIC_CONVEX_URL is not a valid absolute URL: ${convexUrl}`
    );
  }
}

const convex = new ConvexReactClient(validateConvexUrl());

export default convex;

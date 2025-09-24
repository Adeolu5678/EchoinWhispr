import { ConvexReactClient } from 'convex/react'

/**
 * Validates that the Convex URL environment variable is set and is an absolute URL
 */
function validateConvexUrl(): string {
  const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL

  if (!convexUrl) {
    throw new Error('EXPO_PUBLIC_CONVEX_URL environment variable is not set')
  }

  try {
    const url = new URL(convexUrl)
    if (!url.protocol.startsWith('http')) {
      throw new Error('EXPO_PUBLIC_CONVEX_URL must be an absolute URL starting with http:// or https://')
    }
    return convexUrl
  } catch (error) {
    throw new Error(`EXPO_PUBLIC_CONVEX_URL is not a valid absolute URL: ${convexUrl}`)
  }
}

const convex = new ConvexReactClient(validateConvexUrl())

export default convex
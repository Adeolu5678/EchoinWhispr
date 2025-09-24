import { ConvexReactClient } from 'convex/react'
import { api } from '../../../Convex/convex/_generated/api'

/**
 * Validates that the Convex URL environment variable is set and is an absolute URL
 * Enhanced with diagnostic logging for debugging purposes
 */
function validateConvexUrl(): string {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL

  if (!convexUrl) {
    const error = new Error('NEXT_PUBLIC_CONVEX_URL environment variable is not set')
    throw error
  }

  try {
    const url = new URL(convexUrl)
    const isValidProtocol = url.protocol.startsWith('http')

    if (!isValidProtocol) {
      const error = new Error('NEXT_PUBLIC_CONVEX_URL must be an absolute URL starting with http:// or https://')
      throw error
    }

    return convexUrl
  } catch (error) {
    const errorMessage = `NEXT_PUBLIC_CONVEX_URL is not a valid absolute URL: ${convexUrl}`
    throw new Error(errorMessage)
  }
}

/**
 * Creates and configures the Convex client with diagnostic logging
 */
function createConvexClient(): ConvexReactClient {
  try {
    const convexUrl = validateConvexUrl()
    const client = new ConvexReactClient(convexUrl)
    return client
  } catch (error) {
    console.error('Failed to create Convex client:', error)
    throw error
  }
}

const convex = createConvexClient()

export default convex
export { api }
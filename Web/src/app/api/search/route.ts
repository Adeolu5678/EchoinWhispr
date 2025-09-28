import { NextRequest, NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../Convex/convex/_generated/api';

import { auth } from '@clerk/nextjs/server';

/**
 * Handle authenticated user search requests and return matching users.
 *
 * Validates the search query and pagination parameters, verifies the caller via Clerk,
 * queries Convex for the current user and performs a user search excluding the requester.
 *
 * @returns A JSON response with the matched users array on success; an error object and an appropriate HTTP status on failure.
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request using Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { query, limit = 20, offset = 0 } = body;

    // Validate search query
    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Search query must be a non-empty string' },
        { status: 400 }
      );
    }

    if (query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    if (query.length > 100) {
      return NextResponse.json(
        { error: 'Search query must be less than 100 characters long' },
        { status: 400 }
      );
    }

    // Validate pagination parameters
    const parsedLimit = Math.min(Math.max(1, limit), 50); // 1-50
    const parsedOffset = Math.max(0, offset);

    // Initialize Convex client
    const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
    if (!convexUrl) {
      console.error('NEXT_PUBLIC_CONVEX_URL environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const convex = new ConvexHttpClient(convexUrl);

    // Get the current user from Convex using Clerk ID to obtain the Convex user ID
    const currentUser = await convex.query(api.users.getUserByClerkId, {
      clerkId: userId,
    });

    if (!currentUser) {
      console.error('Authenticated user not found in Convex database');
      return NextResponse.json(
        { error: 'User data not found' },
        { status: 404 }
      );
    }

    // Call Convex search function with the proper Convex user ID
    const searchResult = await convex.query(api.users.searchUsers, {
      query: query.trim(),
      limit: parsedLimit,
      offset: parsedOffset,
      excludeUserId: currentUser._id,
    });

    // Return the search results
    return NextResponse.json(searchResult.results);

  } catch (error) {
    console.error('User search API error:', error);

    // Handle specific Convex errors
    if (error instanceof Error) {
      if (error.message.includes('must be at least 2 characters')) {
        return NextResponse.json(
          { error: 'Search query too short' },
          { status: 400 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: 'An error occurred while searching users' },
      { status: 500 }
    );
  }
}
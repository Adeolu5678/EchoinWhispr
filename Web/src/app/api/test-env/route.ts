import { NextResponse } from 'next/server';

/**
 * Test API route to verify CLERK_SECRET_KEY is accessible
 * This route is for debugging purposes only and should be removed in production
 */
export async function GET() {
  try {
    // Test if CLERK_SECRET_KEY is accessible
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;

    if (!clerkSecretKey) {
      console.error('CLERK_SECRET_KEY is not defined');
      return NextResponse.json(
        { error: 'CLERK_SECRET_KEY is not defined' },
        { status: 500 }
      );
    }

    // Log the key length for verification (don't log the actual key for security)
    console.log(`CLERK_SECRET_KEY is loaded, length: ${clerkSecretKey.length}`);

    return NextResponse.json({
      success: true,
      message: 'CLERK_SECRET_KEY is accessible',
      keyLength: clerkSecretKey.length,
      keyPrefix: clerkSecretKey.substring(0, 10) + '...'
    });
  } catch (error) {
    console.error('Error testing CLERK_SECRET_KEY:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';

/**
 * Test API route to verify CLERK_SECRET_KEY is accessible
 * This route is for debugging purposes only and should be removed in production
 */
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }
  try {
    const isDefined = Boolean(process.env.CLERK_SECRET_KEY);
    return NextResponse.json({
      success: isDefined,
      message: isDefined ? 'Secret is set' : 'Secret is missing',
    });
  } catch (error) {
    console.error('Error testing CLERK_SECRET_KEY:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

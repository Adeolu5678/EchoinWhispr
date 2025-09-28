import { NextResponse } from 'next/server';

/**
 * Checks whether CLERK_SECRET_KEY is available and returns a diagnostic JSON response.
 *
 * In production this returns a 404 Not Found. In non-production this returns `{ success, message }`
 * where `success` is `true` if `process.env.CLERK_SECRET_KEY` is set and `message` is either
 * `"Secret is set"` or `"Secret is missing"`. On unexpected errors returns a 500 error JSON.
 *
 * @returns A NextResponse JSON containing either `{ success: boolean, message: string }` for the diagnostic
 *          result, `{ error: 'Not Found' }` with status 404 in production, or `{ error: 'Internal server error' }`
 *          with status 500 on failure.
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

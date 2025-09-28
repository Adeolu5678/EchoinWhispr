'use client';

import { useAuth, useUser } from '@clerk/nextjs';
import { useConvexAuth } from 'convex/react';
import { useMutation } from 'convex/react';
import { api } from '@/lib/convex';
import { useState } from 'react';

/**
 * UI component that provides controls and diagnostics to test creating or retrieving the current user in Convex using Clerk authentication.
 *
 * Renders the current Clerk and Convex authentication state, a button that invokes the server-side `getOrCreateCurrentUser` mutation, and a panel showing the test result. The test action logs detailed debug information to the browser console and disables the button until Clerk is loaded, a Clerk user ID is present, and Convex is authenticated.
 *
 * @returns A React element containing the test UI: current state display, a "Test User Creation" button (disabled when prerequisites are not met or a test is running), and a test result output area.
 */
function UserCreationTestComponent() {
  const { isLoaded: isClerkLoaded, user } = useUser();
  const { userId } = useAuth();
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } =
    useConvexAuth();
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const getOrCreateUser = useMutation(api.users.getOrCreateCurrentUser);

  const runTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      console.log('🧪 [Test] Starting user creation test...');
      console.log('🧪 [Test] Clerk state:', {
        isClerkLoaded,
        userId,
        user: user
          ? {
              id: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              username: user.username,
              firstName: user.firstName,
              lastName: user.lastName,
            }
          : null,
      });
      console.log('🧪 [Test] Convex state:', {
        isConvexAuthenticated,
        isConvexLoading,
      });

      if (!isClerkLoaded || !userId || !isConvexAuthenticated) {
        throw new Error(
          'Prerequisites not met: Clerk not loaded, no user ID, or Convex not authenticated'
        );
      }

      console.log('🧪 [Test] Calling getOrCreateCurrentUser...');
      const result = await getOrCreateUser();
      console.log('🧪 [Test] Result:', result);

      setTestResult(
        `✅ Success! User created/retrieved: ${JSON.stringify(result, null, 2)}`
      );
    } catch (error) {
      console.error('🧪 [Test] Error:', error);
      setTestResult(
        `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsTesting(false);
    }
  };

  if (!isClerkLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading Clerk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-3xl font-bold mb-4">User Creation Debug Test</h1>

        <div className="bg-gray-50 p-4 rounded-lg text-left">
          <h2 className="text-lg font-semibold mb-2">Current State:</h2>
          <div className="space-y-1 text-sm">
            <p>
              <strong>Clerk Loaded:</strong> {isClerkLoaded ? '✅' : '❌'}
            </p>
            <p>
              <strong>User ID:</strong> {userId || 'Not signed in'}
            </p>
            <p>
              <strong>Convex Authenticated:</strong>{' '}
              {isConvexAuthenticated ? '✅' : '❌'}
            </p>
            <p>
              <strong>Convex Loading:</strong> {isConvexLoading ? '⏳' : '✅'}
            </p>
            {user && (
              <div className="mt-2">
                <p>
                  <strong>User Email:</strong>{' '}
                  {user.primaryEmailAddress?.emailAddress}
                </p>
                <p>
                  <strong>Username:</strong> {user.username || 'Not set'}
                </p>
                <p>
                  <strong>First Name:</strong> {user.firstName || 'Not set'}
                </p>
                <p>
                  <strong>Last Name:</strong> {user.lastName || 'Not set'}
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={runTest}
          disabled={
            isTesting || !isClerkLoaded || !userId || !isConvexAuthenticated
          }
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isTesting ? 'Testing...' : 'Test User Creation'}
        </button>

        {testResult && (
          <div className="bg-white p-4 rounded-lg border text-left">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
          </div>
        )}

        <div className="text-sm text-gray-600">
          <p>This test will attempt to create or retrieve a user in Convex.</p>
          <p>Check the browser console for detailed debug logs.</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Page that renders the user-creation test UI for debugging Clerk and Convex integration.
 *
 * Renders the UserCreationTestComponent which exposes controls and logs to diagnose user creation flow.
 *
 * @returns The page element that displays the user creation test interface.
 */
export default function TestUserCreationPage() {
  return <UserCreationTestComponent />;
}

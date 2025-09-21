'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface ClerkErrorBoundaryProps {
  children: ReactNode
}

interface ClerkErrorBoundaryState {
  hasError: boolean
  error?: Error
}

/**
 * Error boundary component specifically for Clerk authentication components.
 * Handles Clerk SDK errors gracefully and provides user-friendly error messages.
 */
export class ClerkErrorBoundary extends Component<ClerkErrorBoundaryProps, ClerkErrorBoundaryState> {
  constructor(props: ClerkErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ClerkErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error for debugging
    console.error('Clerk Error Boundary caught an error:', error, errorInfo)

    // Check if it's a network-related error
    if (error.message?.includes('_fetch') || error.message?.includes('network')) {
      console.error('Network error detected in Clerk SDK. Please check your internet connection and Clerk configuration.')
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-red-600 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Error</h1>
            <p className="text-gray-600 mb-6">
              There was a problem loading the authentication system. This might be due to a network issue or configuration problem.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Technical Details
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {this.state.error?.message || 'Unknown error'}
                </pre>
              </details>
            </div>
          </div>
        </main>
      )
    }

    return this.props.children
  }
}
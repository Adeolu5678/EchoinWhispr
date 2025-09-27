'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface ClerkErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional fallback component to render instead of the default error UI
   */
  fallback?: ReactNode;
  /**
   * Optional callback when an error occurs
   */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ClerkErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
  showTechnicalDetails: boolean;
}

/**
 * Error boundary component specifically designed for Clerk authentication components.
 * Handles Clerk SDK errors gracefully with user-friendly error UI, retry functionality,
 * and comprehensive error logging.
 *
 * Features:
 * - Graceful error handling for Clerk authentication components
 * - User-friendly error messages with retry functionality
 * - Comprehensive error logging for debugging
 * - Network error detection and specific messaging
 * - Collapsible technical details for advanced users
 * - Toast notifications for better UX
 */
export class ClerkErrorBoundary extends Component<
  ClerkErrorBoundaryProps,
  ClerkErrorBoundaryState
> {
  constructor(props: ClerkErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
      showTechnicalDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Store error info for technical details
    this.setState({
      errorInfo,
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // Comprehensive error logging
    console.group('🔐 Clerk Authentication Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();

    // Detect specific error types for better user messaging
    const isNetworkError = this.isNetworkError(error);
    const isConfigurationError = this.isConfigurationError(error);
    const isAuthError = this.isAuthError(error);

    if (isNetworkError) {
      console.warn('🌐 Network connectivity issue detected in Clerk SDK');
    }

    if (isConfigurationError) {
      console.warn('⚙️ Configuration issue detected in Clerk SDK');
    }

    if (isAuthError) {
      console.warn('🔑 Authentication-specific error detected');
    }

    // Log to external service in production (placeholder for future integration)
    if (process.env.NODE_ENV === 'production') {
      // TODO: Integrate with error logging service (e.g., Sentry, LogRocket)
      console.log('Production error logged (placeholder)');
    }
  }

  /**
   * Determines if the error is network-related
   */
  private isNetworkError(error: Error): boolean {
    const networkErrorPatterns = [
      '_fetch',
      'network',
      'fetch',
      'connection',
      'timeout',
      'offline',
      'net::',
      'failed to fetch',
    ];

    return networkErrorPatterns.some(pattern =>
      error.message?.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Determines if the error is configuration-related
   */
  private isConfigurationError(error: Error): boolean {
    const configErrorPatterns = [
      'configuration',
      'config',
      'setup',
      'initialization',
      'invalid',
      'missing',
      'undefined',
    ];

    return configErrorPatterns.some(pattern =>
      error.message?.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Determines if the error is authentication-specific
   */
  private isAuthError(error: Error): boolean {
    const authErrorPatterns = [
      'auth',
      'authentication',
      'session',
      'token',
      'jwt',
      'unauthorized',
      'forbidden',
    ];

    return authErrorPatterns.some(pattern =>
      error.message?.toLowerCase().includes(pattern.toLowerCase())
    );
  }

  /**
   * Handles retry functionality with exponential backoff
   */
  private handleRetry = () => {
    const { retryCount } = this.state;
    if (retryCount >= 3) return;

    // Implement exponential backoff for retries
    const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);

    console.log(
      `🔄 Retrying Clerk authentication (attempt ${retryCount + 1})...`
    );

    setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1,
        showTechnicalDetails: false,
      }));
    }, delay);
  };

  /**
   * Toggles technical details visibility
   */
  private toggleTechnicalDetails = () => {
    this.setState(prevState => ({
      showTechnicalDetails: !prevState.showTechnicalDetails,
    }));
  };

  render() {
    const { hasError, error, retryCount, showTechnicalDetails } = this.state;

    if (hasError && error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError = this.isNetworkError(error);
      const isConfigurationError = this.isConfigurationError(error);
      const isAuthError = this.isAuthError(error);

      // Determine error message based on error type
      let errorTitle = 'Authentication Error';
      let errorDescription =
        'There was a problem loading the authentication system.';

      if (isNetworkError) {
        errorTitle = 'Connection Error';
        errorDescription =
          'Unable to connect to the authentication service. Please check your internet connection and try again.';
      } else if (isConfigurationError) {
        errorTitle = 'Configuration Error';
        errorDescription =
          'There seems to be a configuration issue with the authentication system.';
      } else if (isAuthError) {
        errorTitle = 'Authentication Service Error';
        errorDescription =
          'The authentication service encountered an unexpected error.';
      }

      return (
        <main
          className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50"
          aria-live="assertive"
        >
          <Card className="w-full max-w-md" role="alert">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {errorTitle}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {errorDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button
                  onClick={this.handleRetry}
                  className="w-full"
                  disabled={retryCount >= 3}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {retryCount === 0
                    ? 'Try Again'
                    : `Try Again (${retryCount}/3)`}
                </Button>

                {retryCount >= 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    Maximum retry attempts reached. Please refresh the page.
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={this.toggleTechnicalDetails}
                  className="w-full justify-between text-gray-600 hover:text-gray-900"
                  aria-expanded={showTechnicalDetails}
                  aria-controls="clerk-error-technical-details"
                >
                  Technical Details
                  {showTechnicalDetails ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showTechnicalDetails && (
                  <div
                    id="clerk-error-technical-details"
                    className="mt-2 rounded-md bg-gray-100 p-3"
                  >
                    <div className="text-xs text-gray-700">
                      <div className="mb-2 font-medium">Error Message:</div>
                      <div className="mb-3 font-mono break-all">
                        {error.message || 'Unknown error'}
                      </div>

                      {error.stack && (
                        <>
                          <div className="mb-2 font-medium">Stack Trace:</div>
                          <pre className="whitespace-pre-wrap text-xs leading-relaxed">
                            {error.stack}
                          </pre>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      );
    }

    return this.props.children;
  }
}

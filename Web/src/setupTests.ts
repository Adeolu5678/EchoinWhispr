/**
 * Jest test setup file
 * Configures testing utilities and global mocks
 */

import '@testing-library/jest-dom';
import React from 'react';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    // Return a simple img element for testing
    return React.createElement('img', { ...props, alt: props.alt || '' });
  },
}));

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user-id',
  }),
  useUser: () => ({
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: 'test-user-id',
      firstName: 'Test',
      lastName: 'User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
  }),
  SignedIn: function MockSignedIn({ children }: { children: React.ReactNode }) {
    return children;
  },
  SignedOut: function MockSignedOut() {
    return null;
  },
  ClerkProvider: function MockClerkProvider({ children }: { children: React.ReactNode }) {
    return children;
  },
}));

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(() => undefined),
  useMutation: jest.fn(() => jest.fn()),
  useConvex: jest.fn(() => ({})),
  ConvexProvider: function MockConvexProvider({ children }: { children: React.ReactNode }) {
    return children;
  },
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: function MockMotionDiv({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) {
      return React.createElement('div', props, children);
    },
    span: function MockMotionSpan({ children, ...props }: React.HTMLAttributes<HTMLSpanElement> & { children?: React.ReactNode }) {
      return React.createElement('span', props, children);
    },
    button: function MockMotionButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { children?: React.ReactNode }) {
      return React.createElement('button', props, children);
    },
  },
  AnimatePresence: function MockAnimatePresence({ children }: { children: React.ReactNode }) {
    return children;
  },
}));

// Global fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  } as Response)
);

// Console warning/error suppression for cleaner test output
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Warning: An update to'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning:')
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Clear mocks between tests
afterEach(() => {
  jest.clearAllMocks();
});

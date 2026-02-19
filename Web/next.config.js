/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Development Convex deployment
      {
        protocol: 'https',
        hostname: 'gregarious-puma-353.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
      // Production Convex deployment
      {
        protocol: 'https',
        hostname: 'youthful-sandpiper-909.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
      // Wildcard for any Convex cloud deployment (future-proof)
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
        port: '',
        pathname: '/api/storage/**',
      },
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Build-time environment variable validation
  env: {
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  },
  // Webpack configuration
  webpack: (config) => {
    // Suppress the "Serializing big strings" webpack cache warning
    // This warning occurs when webpack serializes its cache and encounters large strings
    // (like generated API code from Convex). It's a performance hint, not an error.
    config.infrastructureLogging = {
      level: 'error',
    };
    return config;
  },
};

module.exports = nextConfig;

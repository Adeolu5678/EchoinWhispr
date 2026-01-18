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
};

module.exports = nextConfig;

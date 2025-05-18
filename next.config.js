/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // TypeScript compilation
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // ignoreBuildErrors: true,
  },

  // Enable strict mode in development
  reactStrictMode: true,

  // Add images domains if you're fetching images from external sources
  images: {
    domains: [],
  },

  // Environment variables that should be exposed to the client
  env: {
    // Add your public env variables here
  },

  // Enable experimental features if needed
  experimental: {
    // Add experimental features here
  },
  // Add other config options here
};

module.exports = nextConfig; 
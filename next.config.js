/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    domains: ["placehold.co", "images.unsplash.com"],
  },
  // Configuration for Next.js
  experimental: {
    // Add any experimental features here if needed
  },
  // Ignore ESLint errors during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Enable standalone output mode for Docker deployment
  output: "standalone",
};

module.exports = nextConfig;

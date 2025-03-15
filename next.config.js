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
    optimizeCss: true, // Optimize CSS for better performance
    scrollRestoration: true, // Improve scroll restoration
  },
  // Ignore ESLint errors during build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Enable standalone output mode for Docker deployment
  output: "standalone",

  // Optimize chunk loading
  poweredByHeader: false,
  compress: true,

  // Increase timeout for chunk loading
  staticPageGenerationTimeout: 180, // Increased from 120 to 180 seconds

  // Optimize for production
  productionBrowserSourceMaps: false,

  // Webpack configuration to optimize chunk loading
  webpack: (config, { isServer }) => {
    // Optimize chunk size
    config.optimization.splitChunks = {
      chunks: "all",
      maxInitialRequests: 25,
      minSize: 20000,
      cacheGroups: {
        default: false,
        vendors: false,
        // Vendor chunk for third-party modules
        vendor: {
          name: "vendor",
          chunks: "all",
          test: /node_modules/,
          priority: 20,
        },
        // Common chunk for shared code
        common: {
          name: "common",
          minChunks: 2,
          chunks: "all",
          priority: 10,
          reuseExistingChunk: true,
          enforce: true,
        },
      },
    };

    // Add a fallback for chunk loading errors
    if (!isServer) {
      config.output.chunkLoadTimeout = 60000; // 60 seconds timeout for chunk loading
    }

    return config;
  },
};

module.exports = nextConfig;

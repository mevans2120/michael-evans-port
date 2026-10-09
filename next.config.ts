import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image configuration for Sanity CDN
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Performance optimizations
  experimental: {
    // Optimize CSS loading and chunking (production only - breaks HMR in dev)
    optimizeCss: process.env.NODE_ENV === 'production',

    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      '@radix-ui/react-accordion',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-popover',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
    ],
  },

  // Compiler optimizations
  compiler: {
    // Strip console.log in production but keep structured/diagnostic output
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn', 'info'] } : false,
  },

  // Turbopack configuration
  // Using default root (project root)

  // ESLint configuration for builds
  eslint: {
    // Lint only source directories during builds
    dirs: ['src', 'sanity'],
  },
};

export default nextConfig;

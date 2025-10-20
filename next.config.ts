import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image configuration for Sanity CDN
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },

  // Turbopack configuration
  // Using default root (project root)
};

export default nextConfig;

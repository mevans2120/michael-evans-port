import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image configuration for Sanity CDN
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
  },

  // Turbopack configuration
  turbopack: {
    root: '/Users/michaelevans/michael-evans-port-main/nextjs-app',
  },
};

export default nextConfig;

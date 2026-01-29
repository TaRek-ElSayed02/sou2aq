import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  // Enable experimental multi-zone for subdomain support
  experimental: {
    allowedOrigins: ['localhost', '*.localhost'],
  },
};

export default nextConfig;
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'cdn.lftcm.org', 'cdn.vnftf.org'],
  },
  // Enable subdomain routing for branches
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Rewrites for branch subdomains
  async rewrites() {
    return {
      beforeFiles: [
        // Branch-specific routes
        {
          source: '/branch/:slug*',
          destination: '/branch/[slug]/page',
        },
      ],
    };
  },
};

export default nextConfig;

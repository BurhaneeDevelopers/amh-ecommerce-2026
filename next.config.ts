import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true, // ✅ disables type checking at build time
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "www.hy-techengineers.com",
      },
      {
        protocol: "https",
        hostname: "opencart.mahardhi.com",
      },
      {
        protocol: "https",
        hostname: "viahhucblkcnboxtqnyv.supabase.co",
      },
    ],
    // unoptimized: true
  },
  // Remove X-Powered-By header for security
  poweredByHeader: false,
  // Enable compression
  compress: true,
  // Add security and SEO headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
    ];
  },
  // Redirect www to non-www for canonical domain consistency
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.hydraulicstore.in',
          },
        ],
        destination: 'https://hydraulicstore.in/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

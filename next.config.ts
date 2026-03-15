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
        hostname: "opencart.mahardhi.com",
      },
      {
        protocol: "https",
        hostname: "lrjjmgwreqdmaracyfof.supabase.co",
      },
    ],
    // unoptimized: true
  },
};

export default nextConfig;

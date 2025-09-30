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
        hostname: "ujfnvcsnaeadenlwhqid.supabase.co",
      },
    ],
  },
};

export default nextConfig;

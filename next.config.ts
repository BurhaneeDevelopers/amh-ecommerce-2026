import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  }
};

export default nextConfig;

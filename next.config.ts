import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",

        hostname: "vcurlhurvhjgmxxhsasd.supabase.co",
      },
    ],
  },
};

export default nextConfig;

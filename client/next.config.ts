import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACK_URL}/:path*`,
      },
      {
        source: "/api/v1/socket/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACK_URL}/:path*`,
      },
    ]
  }
};

export default nextConfig;

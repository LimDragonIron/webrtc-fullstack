import type { NextConfig } from "next";
import NextJsAppProperties from "./next.properties"

const nextConfig: NextConfig = {
  /* config options here */
  output:"standalone",
  reactStrictMode: false,
  env: {
    login_endpoint: NextJsAppProperties.login_endpoint
  },
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

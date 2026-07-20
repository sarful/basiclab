import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
const backendBaseUrl = process.env.NEXT_PUBLIC_LMS_API_BASE_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: projectRoot,
  },
  async rewrites() {
    if (!backendBaseUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/ster_delta_with_timer",
        destination: "/star-delta-with-timer",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

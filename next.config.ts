import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'im.runware.ai',
        port: '',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;

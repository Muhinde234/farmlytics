import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: 'https://farmlytics1-1.onrender.com/api/v1/:path*',
      },
    ]
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);


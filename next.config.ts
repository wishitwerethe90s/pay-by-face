import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:slug*',
        destination: 'http://localhost:5001/:slug*'
      }
    ]
  }
};

export default nextConfig;

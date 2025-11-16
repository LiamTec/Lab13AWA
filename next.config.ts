import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images  : {
    // allowed legacy domains
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
    // preferred newer config to allow more flexible remote patterns
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

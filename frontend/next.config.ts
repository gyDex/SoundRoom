import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
      domains: [
        'dbewlidfconvgnyulifx.supabase.co',
        'lh3.googleusercontent.com', // if using Google auth
        'avatars.githubusercontent.com', // if using GitHub auth
      ],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Allow all domains (use with caution)
        },
      ],
    },
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Cross-Origin-Opener-Policy',
              value: 'unsafe-none',
            },
            {
              key: 'Cross-Origin-Embedder-Policy',
              value: 'unsafe-none',
            },
          ],
        },
      ];
    },
    sassOptions: {
      additionalData: `
        @import "./src/app/variables.scss";
      `,
  },
};

export default nextConfig;

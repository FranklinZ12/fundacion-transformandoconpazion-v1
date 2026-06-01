/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove "X-Powered-By: Next.js" header (security)
  poweredByHeader: false,

  // Compress responses with gzip
  compress: true,

  // Security headers for all routes
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      // Cache static assets for 1 year
      {
        source: '/images/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "comtadzsyoaxxyinpgvv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: 'https',
        hostname: '9f1e8b6678.cbaul-cdnwnd.com',
      },
      {
        protocol: 'https',
        hostname: '7b43b669ac.cbaul-cdnwnd.com',
      },
    ],
  },
};

export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,

  // Prevent source maps in production (smaller JS bundles)
  productionBrowserSourceMaps: false,

  images: {
    // Serve modern formats (AVIF is 50% smaller than WebP, 70% smaller than JPEG)
    formats: ["image/avif", "image/webp"],
    // Aggressive caching — images don't change often
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    // Only allow sanity CDN for remote images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    // Device sizes for responsive srcset
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers for better caching and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Aggressive caching for static assets
        source: "/(.*)\\.(jpg|jpeg|png|webp|avif|svg|ico|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

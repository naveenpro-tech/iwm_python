/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.32',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'api.moviemadders.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Movie Madders',
    NEXT_PUBLIC_BETA_VERSION: process.env.NEXT_PUBLIC_BETA_VERSION || 'true',
    NEXT_PUBLIC_VERSION: process.env.NEXT_PUBLIC_VERSION || '0.1.0-beta',
  },
}

export default nextConfig

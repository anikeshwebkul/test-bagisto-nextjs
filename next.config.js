/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.IMAGE_DOMAIN,
      },
    ],
  },
  env: {
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    BAGISTO_STORE_DOMAIN: process.env.BAGISTO_STORE_DOMAIN,
    REVALIDATION_DURATION: process.env.REVALIDATION_DURATION,
    SITE_NAME: process.env.SITE_NAME,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

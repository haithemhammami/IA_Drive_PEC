/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Désactive ESLint pendant la build
  },
  images: {
    domains: ["img.youtube.com"],
  },
};

module.exports = nextConfig;

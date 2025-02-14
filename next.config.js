///** @type {import('next').NextConfig} */
//const nextConfig = {
//  reactStrictMode: true,
//  eslint: {
//    ignoreDuringBuilds: true, // Désactive ESLint pendant la build
//  },
//  images: {
//    domains: ["img.youtube.com"],
//  },
//};
//
//module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const path = require("path")

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["img.youtube.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tailwindui.com",
        pathname: "/plus/img/logos/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /favicon\.ico$/,
      use: path.resolve(__dirname, "node_modules/null-loader"),
    })
    return config
  },
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
  },
}

module.exports = nextConfig


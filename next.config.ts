import path from "path";
import { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    });
    return config;
  },
  serverExternalPackages: ["@prisma/client", "bcrypt"],
};

export default nextConfig;


//next.config.js
///** @type {import('next').NextConfig} */
//const path = require("path")
//
//const nextConfig = {
//  reactStrictMode: true,
//  eslint: {
//    ignoreDuringBuilds: true,
//  },
//  images: {
//    domains: ["img.youtube.com"],
//    remotePatterns: [
//      {
//        protocol: "https",
//        hostname: "tailwindui.com",
//        pathname: "/plus/img/logos/**",
//      },
//    ],
//    dangerouslyAllowSVG: true,
//  },
//  webpack: (config) => {
//    config.module.rules.push({
//      test: /favicon\.ico$/,
//      use: path.resolve(__dirname, "node_modules/null-loader"),
//    })
//    return config
//  },
//  experimental: {
//    serverExternalPackages: ["@prisma/client", "bcrypt"],
//
//  },
//}
//
//module.exports = nextConfig
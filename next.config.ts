//const path = require("path")
//
//const nextConfig = {
//  webpack: (config: { module: { rules: { test: RegExp; use: any }[] } }) => {
//    config.module.rules.push({
//      test: /favicon\.ico$/,
//      use: path.resolve(__dirname, "node_modules/null-loader"),
//    })
//    return config
//  },
//  images: {
//    remotePatterns: [
//      {
//        protocol: "https",
//        hostname: "tailwindui.com",
//        pathname: "/plus/img/logos/**",
//      },
//    ],
//    dangerouslyAllowSVG: true, // Active cette option pour autoriser les SVG
//  },
//  experimental: {
//    serverComponentsExternalPackages: ["@prisma/client", "bcrypt"],
//  },
//}
//
//module.exports = nextConfig

const path = require("path");

const nextConfig = {
  webpack: (config: { module: { rules: { test: RegExp; use: any; }[]; }; }) => {
    config.module.rules.push({
      test: /favicon\.ico$/,
      use: path.resolve(__dirname, "node_modules/null-loader"),
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tailwindui.com',
        pathname: '/plus/img/logos/**',
      },
    ],
    dangerouslyAllowSVG: true, // Active cette option pour autoriser les SVG
  },
};

export default nextConfig;

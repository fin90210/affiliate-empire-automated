
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { 
    unoptimized: true,
    domains: []
  },
  experimental: {
    serverExternalPackages: ['puppeteer']
  }
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@radix-ui',
    'lucide-react',
    'embla-carousel-react',
    'cmdk',
  ],
};

module.exports = nextConfig;

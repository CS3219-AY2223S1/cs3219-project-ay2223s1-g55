/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/signup',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;

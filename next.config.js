/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",

  async rewrites() {
    return [
      {
        /**
         * This matches any request starting with /uploads/
         * and redirects it to your dynamic API handler.
         */
        source: "/uploads/:path*",
        destination: "/api/upload/:path*",
      },
    ];
  },
};

module.exports = nextConfig;

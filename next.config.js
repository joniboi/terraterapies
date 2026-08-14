/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  distDir:
    process.env.NEXT_PUBLIC_BRAND === "lotus" ? ".next-lotus" : ".next-terra",
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
  async redirects() {
    return [
      {
        source: "/:lang/facials/:slug*",
        destination: "/:lang/faciales/:slug*",
        permanent: true,
      },
      {
        source: "/:lang/bono-sesion/:slug*",
        destination: "/:lang/bonos/:slug*",
        permanent: true,
      },
      {
        source: "/:lang/pareja-01/:slug*",
        destination: "/:lang/rituales-en-pareja/:slug*",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;

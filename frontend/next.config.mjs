/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "10.220.0.8",
        port: "9000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cardsfrontend.vercel.app",
        pathname: "/uploads/**",
        port: "10000",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.example.com",
      },
      {
        protocol: "https",
        hostname: "water-api.zimaw.com",
      },
      {
        protocol: "http",
        hostname: "water-api.zimaw.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api.thuexeonline.site",
      },
      {
        protocol: "http",
        hostname: "api.thuexeonline.site",
      },
    ],
  },
};

export default nextConfig;

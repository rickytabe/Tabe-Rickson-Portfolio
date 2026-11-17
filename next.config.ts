import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["172.20.10.12", "192.168.1.128"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async redirects() {
    // The book used to live at /algorithms; keep old links (page, PDF, OG image) working.
    return [
      { source: "/algorithms", destination: "/algorithms-made-easy-csc207", permanent: true },
      { source: "/algorithms/:path*", destination: "/algorithms-made-easy-csc207/:path*", permanent: true },
    ];
  },
};

export default nextConfig;

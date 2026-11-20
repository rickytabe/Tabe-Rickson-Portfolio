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
      // Short link for sharing, e.g. taberickson.com/csc207?ref=l2 (query strings carry over).
      // Temporary on purpose, so /csc207 can later become its own page (e.g. book + tutorials).
      { source: "/csc207", destination: "/algorithms-made-easy-csc207", permanent: false },
      // CSC211 Tutorial Sheet Solutions: the same short links. Invite links look like /csc211?ref=i-k7p2xq9m.
      // Link previews follow the redirect and show the book's own cover.
      { source: "/csc211", destination: "/csc211-tutorial-solutions", permanent: false },
      { source: "/csc211/quiz", destination: "/csc211-tutorial-solutions?quiz=1", permanent: false },
    ];
  },
};

export default nextConfig;

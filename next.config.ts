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
      // CSC207 Tutorial Sheet Solutions: /csc207 and /csc207/quiz already belong to CSC207 Made Easy.
      { source: "/csc207/tutorial", destination: "/csc207-tutorial-solutions", permanent: false },
      { source: "/csc207/tutorial/quiz", destination: "/csc207-tutorial-solutions?quiz=1", permanent: false },
      // CSC207 CA 2025 (the 26/11/2025 paper). First published as "Test 1" at /csc207-test-1-solutions and
      // /csc207/test1, then briefly as "CA 2024": those links were shared, so keep them.
      { source: "/csc207/ca2025", destination: "/csc207-ca-2025-solutions", permanent: false },
      { source: "/csc207/ca2025/quiz", destination: "/csc207-ca-2025-solutions?quiz=1", permanent: false },
      { source: "/csc207-test-1-solutions", destination: "/csc207-ca-2025-solutions", permanent: true },
      { source: "/csc207/test1", destination: "/csc207-ca-2025-solutions", permanent: false },
      { source: "/csc207/test1/quiz", destination: "/csc207-ca-2025-solutions?quiz=1", permanent: false },
      // CSC207 CA 2024 (the 20/11/2024 paper).
      { source: "/csc207/ca2024", destination: "/csc207-ca-2024-solutions", permanent: false },
      { source: "/csc207/ca2024/quiz", destination: "/csc207-ca-2024-solutions?quiz=1", permanent: false },
    ];
  },
};

export default nextConfig;

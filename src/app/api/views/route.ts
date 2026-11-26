import { NextResponse } from "next/server";
import { getPathViews } from "@/lib/vercel/analytics";

// Paths whose view counts may be read, each with older URLs whose views still count toward it.
const COUNTED: Record<string, string[]> = {
  "/algorithms-made-easy-csc207": ["/algorithms-made-easy-csc207", "/algorithms"],
  "/csc211-tutorial-solutions": ["/csc211-tutorial-solutions"],
  "/csc207-tutorial-solutions": ["/csc207-tutorial-solutions"],
  "/csc207-ca-2025-solutions": ["/csc207-ca-2025-solutions", "/csc207-test-1-solutions"],
  "/csc207-ca-2024-solutions": ["/csc207-ca-2024-solutions"],
  "/csc205-revision": ["/csc205-revision"],
  "/csc205-ca-solutions": ["/csc205-ca-solutions"],
  "/csc211-ca-solutions": ["/csc211-ca-solutions"],
};

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path") ?? "";
  const sources = COUNTED[path];
  if (!sources) {
    return NextResponse.json({ error: "Unknown path" }, { status: 404 });
  }

  const counts = await Promise.all(sources.map((p) => getPathViews(p)));
  const known = counts.filter((n): n is number => n !== null);
  const views = known.length ? known.reduce((a, b) => a + b, 0) : null;

  return NextResponse.json(
    { views },
    // Shared caches hold the count for 5 minutes, so readers never hit the analytics API directly.
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}

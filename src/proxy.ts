import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Page paths are case-sensitive, so /Algorithms-made-easy-csc207 would 404. Redirect that
// spelling to the canonical lowercase URL. This can't be a next.config redirect: those match
// case-insensitively, so the rule would also catch the lowercase URL and loop.
export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/algorithms-made-easy-csc207";
  return NextResponse.redirect(url, 308);
}

// Matched case-sensitively, so this runs only for the capitalised spelling.
export const config = {
  matcher: "/Algorithms-made-easy-csc207",
};

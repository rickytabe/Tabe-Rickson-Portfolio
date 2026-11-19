import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BOOK = "/algorithms-made-easy-csc207";

// Link-preview and search crawlers. They get the quiz page's preview card; people get Algo.
const PREVIEW_BOT =
  /facebookexternalhit|facebot|whatsapp|twitterbot|telegrambot|slackbot|linkedinbot|discordbot|skypeuripreview|pinterest|redditbot|snapchat|embedly|iframely|vkshare|googlebot|bingbot|applebot|duckduckbot|yandex/i;

export function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();

  // /csc207/quiz: people go straight to the book with Algo open (query tags kept); preview bots
  // fall through to the page, which carries the quiz preview image.
  if (url.pathname === "/csc207/quiz") {
    if (PREVIEW_BOT.test(request.headers.get("user-agent") ?? "")) return NextResponse.next();
    url.pathname = BOOK;
    url.searchParams.set("quiz", "1");
    return NextResponse.redirect(url, 307);
  }

  // Page paths are case-sensitive, so /Algorithms-made-easy-csc207 would 404. Redirect that
  // spelling to the canonical lowercase URL. This can't be a next.config redirect: those match
  // case-insensitively, so the rule would also catch the lowercase URL and loop.
  url.pathname = BOOK;
  return NextResponse.redirect(url, 308);
}

// Matched case-sensitively, so the book rule runs only for the capitalised spelling.
export const config = {
  matcher: ["/Algorithms-made-easy-csc207", "/csc207/quiz"],
};

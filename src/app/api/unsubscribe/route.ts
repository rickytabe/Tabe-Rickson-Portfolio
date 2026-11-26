import { NextResponse } from "next/server";
import { getApps } from "firebase-admin/app";
import { unsubscribe, verifyUnsubscribe } from "@/lib/mailing";

/**
 * Unsubscribe from the email list. Two callers:
 * - mail apps' one-click button (RFC 8058): POST to the List-Unsubscribe URL with ?e=&t=;
 * - the confirm button on /unsubscribe: a form POST with e, t, which goes back to the page.
 * The link is signed per address, so nobody can unsubscribe someone else.
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const form = await request.formData().catch(() => null);
  const e = url.searchParams.get("e") ?? form?.get("e");
  const t = url.searchParams.get("t") ?? form?.get("t");
  const fromPage = form?.get("from") === "page";

  const email = verifyUnsubscribe(e, t);
  if (!email) {
    return fromPage
      ? NextResponse.redirect(new URL("/unsubscribe?bad=1", request.url), 303)
      : new NextResponse("Invalid unsubscribe link", { status: 400 });
  }
  if (!getApps().length) return new NextResponse("Unavailable", { status: 503 });

  try {
    await unsubscribe(email);
  } catch (err) {
    console.error("[unsubscribe] failed:", err);
    return fromPage
      ? NextResponse.redirect(new URL(`/unsubscribe?e=${e}&t=${t}&failed=1`, request.url), 303)
      : new NextResponse("Try again later", { status: 500 });
  }
  console.log("[unsubscribe] done");
  return fromPage
    ? NextResponse.redirect(new URL("/unsubscribe?done=1", request.url), 303)
    : new NextResponse("Unsubscribed", { status: 200 });
}

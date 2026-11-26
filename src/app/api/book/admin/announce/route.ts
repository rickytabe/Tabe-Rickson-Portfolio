import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validSession } from "@/lib/insights/admin-auth";
import { insightsEnabled, sameOrigin } from "@/lib/insights/server";
import { BOOKS, type BookId } from "@/lib/books";
import { announceBook, sendTest, skipAnnouncement } from "@/lib/announcements";
import { mailingEnabled } from "@/lib/mailing";

// Sending to the whole list can take a while: one Resend call per 100 subscribers.
export const maxDuration = 300;

const TEST_TO = "rickytabe2@gmail.com";

/**
 * Announce a new book to the email list, from the dashboard. Owner only, same origin only.
 * Form fields: book, blurb, action = "test" (one copy to Tabe) | "send" (everyone, once) | "skip".
 * Redirects back to the dashboard with the outcome in ?ann=.
 */
export async function POST(request: Request) {
  if (!insightsEnabled()) return new NextResponse(null, { status: 404 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const jar = await cookies();
  if (!validSession(jar.get(ADMIN_COOKIE)?.value)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const id = String(form?.get("book") ?? "");
  const back = (ann: string, extra = "") =>
    NextResponse.redirect(new URL(`/book-insights?ann=${ann}&ab=${id}${extra}#announce`, request.url), 303);
  if (!(id in BOOKS)) return back("badbook");
  const book = BOOKS[id as BookId];
  if (!mailingEnabled()) return back("off");

  const action = String(form?.get("action") ?? "");
  const blurb = String(form?.get("blurb") ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 400) || book.blurb;

  if (action === "skip") {
    return back((await skipAnnouncement(book)) ? "skipped" : "already");
  }

  if (action === "test") {
    try {
      await sendTest(book, blurb, TEST_TO);
      return back("tested");
    } catch (err) {
      console.error("[announce] test failed:", err);
      return back("testfailed");
    }
  }

  if (action === "send") {
    if (form?.get("confirm") !== "yes") return back("confirm");
    const result = await announceBook(book, blurb);
    if (result.ok) return back("sent", `&n=${result.sent}`);
    return back(result.reason);
  }

  return back("badaction");
}

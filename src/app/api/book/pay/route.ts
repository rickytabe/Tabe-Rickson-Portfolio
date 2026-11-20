import { NextResponse } from "next/server";
import { db, ensureReader, insightsEnabled, readerCookie, sameOrigin } from "@/lib/insights/server";
import { bookFrom } from "@/lib/books";
import { fapshiEnabled, startPayment } from "@/lib/fapshi";
import { getUnlock } from "@/lib/unlock";

const MAX_PER_HOUR = 6;

/** Start a Mobile Money payment for a paid book ({ book }). Returns { link } to Fapshi's checkout. */
export async function POST(request: Request) {
  if (!insightsEnabled() || !fapshiEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { book?: unknown };
  const book = bookFrom(body.book);
  if (!book.paywall) return NextResponse.json({ error: "Not a paid book" }, { status: 404 });

  const { rid, isNew } = await ensureReader(request, book);
  const withCookie = (res: NextResponse) => {
    if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
    return res;
  };
  if (await getUnlock(rid, book)) return withCookie(NextResponse.json({ unlocked: true }));

  // Each start creates a real checkout at Fapshi: keep it to a handful per reader per hour.
  const recent = await db().collection("payments").where("rid", "==", rid).limit(50).get();
  const lastHour = recent.docs.filter((d) => Date.now() - Number(d.data().createdAt) < 60 * 60 * 1000).length;
  if (lastHour >= MAX_PER_HOUR) {
    return withCookie(NextResponse.json({ error: "Too many tries. Wait a little, or message Tabe on WhatsApp." }, { status: 429 }));
  }

  try {
    const returnUrl = `${new URL(request.url).origin}${book.path}?paid=1`;
    const link = await startPayment(book, rid, returnUrl);
    return withCookie(NextResponse.json({ link }, { headers: { "Cache-Control": "no-store" } }));
  } catch (error) {
    console.error("Payment start failed", error);
    return withCookie(
      NextResponse.json({ error: "Couldn't reach the payment service. Try again in a minute." }, { status: 502 })
    );
  }
}

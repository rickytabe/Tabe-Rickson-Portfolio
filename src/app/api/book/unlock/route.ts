import { NextResponse } from "next/server";
import { ensureReader, insightsEnabled, readerCookie, readerFromRequest, sameOrigin } from "@/lib/insights/server";
import { bookFrom } from "@/lib/books";
import { getUnlock, inviteStatus, redeemCode } from "@/lib/unlock";
import { fapshiEnabled, settleReaderPayments } from "@/lib/fapshi";

const noStore = { "Cache-Control": "no-store" };

/** Whether this reader has unlocked a paid book (?book=), and their invite link and progress. */
export async function GET(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  const book = bookFrom(new URL(request.url).searchParams.get("book"));
  if (!book.paywall) return NextResponse.json({ error: "Not a paid book" }, { status: 404 });

  const { rid, isNew } = await ensureReader(request, book);
  // A payment that finished but whose webhook never arrived (or a reader just back from checkout).
  if (fapshiEnabled() && !(await getUnlock(rid, book))) {
    await settleReaderPayments(book, rid).catch((e) => console.error("Payment check failed", e));
  }
  const [unlock, invite] = await Promise.all([getUnlock(rid, book), inviteStatus(book, rid)]);
  const res = NextResponse.json(
    {
      unlocked: !!unlock,
      via: unlock?.via ?? null,
      pay: fapshiEnabled(),
      invite: {
        link: `${book.shortLink}?ref=i-${invite.code}`,
        count: Math.min(invite.count, book.paywall.invitesNeeded),
        needed: book.paywall.invitesNeeded,
      },
    },
    { headers: noStore }
  );
  if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
  return res;
}

/** Redeem an unlock code: { book, code }. */
export async function POST(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { book?: unknown; code?: unknown };
  const book = bookFrom(body.book);
  if (!book.paywall) return NextResponse.json({ error: "Not a paid book" }, { status: 404 });

  const existing = readerFromRequest(request);
  const { rid, isNew } = existing ? { rid: existing, isNew: false } : await ensureReader(request, book);
  try {
    const result = await redeemCode(book, rid, body.code);
    const res = result.ok
      ? NextResponse.json({ unlocked: true, via: result.unlock.via }, { headers: noStore })
      : NextResponse.json({ error: result.error }, { status: result.status, headers: noStore });
    if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
    return res;
  } catch (error) {
    console.error("Unlock failed", error);
    return NextResponse.json({ error: "Couldn't check that code. Try again." }, { status: 500 });
  }
}

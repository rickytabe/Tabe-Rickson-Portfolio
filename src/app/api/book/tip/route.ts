import { NextResponse } from "next/server";
import { db, ensureReader, insightsEnabled, readerCookie, sameOrigin } from "@/lib/insights/server";
import { bookFrom } from "@/lib/books";
import { fapshiEnabled, settleReaderTips, startPayment, TIP_AMOUNTS } from "@/lib/fapshi";

const MAX_PER_HOUR = 6;
const noStore = { "Cache-Control": "no-store" };

/** Whether this reader's tip for a book (?book=) is confirmed, and whether tipping is switched on. */
export async function GET(request: Request) {
  if (!insightsEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  const book = bookFrom(new URL(request.url).searchParams.get("book"));
  const { rid, isNew } = await ensureReader(request, book);
  const supported = fapshiEnabled()
    ? await settleReaderTips(book, rid).catch((e) => {
        console.error("Tip check failed", e);
        return false;
      })
    : false;
  const res = NextResponse.json({ supported, pay: fapshiEnabled() }, { headers: noStore });
  if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
  return res;
}

/** Start a voluntary tip through Fapshi: { book, amount }. Returns { link } to the checkout. */
export async function POST(request: Request) {
  if (!insightsEnabled() || !fapshiEnabled()) return NextResponse.json({ error: "offline" }, { status: 503 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as { book?: unknown; amount?: unknown };
  const book = bookFrom(body.book);
  const amount = Number(body.amount);
  if (!(TIP_AMOUNTS as readonly number[]).includes(amount)) {
    return NextResponse.json({ error: "Pick one of the amounts shown." }, { status: 400 });
  }

  const { rid, isNew } = await ensureReader(request, book);
  const withCookie = (res: NextResponse) => {
    if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
    return res;
  };
  const recent = await db().collection("payments").where("rid", "==", rid).limit(50).get();
  const lastHour = recent.docs.filter((d) => Date.now() - Number(d.data().createdAt) < 60 * 60 * 1000).length;
  if (lastHour >= MAX_PER_HOUR) {
    return withCookie(NextResponse.json({ error: "Too many tries. Please wait a little and try again." }, { status: 429 }));
  }

  try {
    const returnUrl = `${new URL(request.url).origin}${book.path}?tipped=1`;
    const link = await startPayment(book, rid, returnUrl, { kind: "tip", amount });
    return withCookie(NextResponse.json({ link }, { headers: noStore }));
  } catch (error) {
    console.error("Tip start failed", error);
    return withCookie(NextResponse.json({ error: "Couldn't reach the payment service. Try again in a minute." }, { status: 502 }));
  }
}

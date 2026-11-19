import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import {
  BOOK_ID,
  cleanRef,
  dayKey,
  db,
  fieldKey,
  insightsEnabled,
  newReaderId,
  readerCookie,
  readerFromRequest,
  sameOrigin,
} from "@/lib/insights/server";

// Every metric counts unique readers: an event is counted the first time a reader sends it.
const CHAPTERS = new Set(Array.from({ length: 24 }, (_, i) => `c${i + 1}`));
const EVENTS: Record<string, (key: string) => boolean> = {
  reach: (k) => CHAPTERS.has(k), // reached a chapter
  end: (k) => k === "", // reached the end of the book
  support_shown: (k) => ["timer", "fab", "sidebar", "footer", "download", "quiz"].includes(k),
  support_copy: (k) => k === "",
  support_dial: (k) => k === "",
  download_free: (k) => k === "", // "I'd love to support, but..." download
  download_supported: (k) => k === "", // downloaded from the thank-you screen
  download_direct: (k) => k === "", // returning supporter, no prompt
  figure_open: (k) => k === "",
  quiz_open: (k) => ["", "fab", "sidebar", "link"].includes(k), // where the reader opened Algo from
  quiz_share: (k) => k === "", // tapped "Challenge a classmate"
  // Older pages sent these; attempt-level quiz numbers are now counted on the server.
  quiz_finish: (k) => /^s([0-9]|10)$/.test(k),
  quiz_miss: (k) => /^q\d{1,3}$/.test(k),
};

type Incoming = { events?: { type?: unknown; key?: unknown }[]; ref?: unknown };

/** Whether insights are switched on (lets us check a deployment without exposing any data). */
export async function GET() {
  return NextResponse.json({ enabled: insightsEnabled() });
}

export async function POST(request: Request) {
  if (!insightsEnabled()) return new NextResponse(null, { status: 204 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  let body: Incoming;
  try {
    body = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const events = (body.events ?? [])
    .slice(0, 40)
    .map((e) => ({ type: String(e.type ?? ""), key: String(e.key ?? "") }))
    .filter((e) => EVENTS[e.type]?.(e.key));

  let rid = readerFromRequest(request);
  const isNew = !rid;
  if (!rid) rid = newReaderId();

  const store = db();
  const reader = store.collection("bookReaders").doc(rid);
  const stats: Record<string, Record<string, FirebaseFirestore.FieldValue>> = {};
  const bump = (group: string, key: string) => {
    (stats[group] ??= {})[fieldKey(key || "total")] = FieldValue.increment(1);
  };

  try {
    if (isNew) {
      const ref = cleanRef(body.ref);
      await reader.set({ book: BOOK_ID, firstSeen: FieldValue.serverTimestamp(), ref: ref ?? null });
      bump("readers", "total");
      bump("refs", ref ?? "direct");
      bump("daily", dayKey());
    }

    // A mark document per reader and event: create() fails if it exists, so each counts once.
    const results = await Promise.allSettled(
      events.map((e) =>
        reader
          .collection("marks")
          .doc(fieldKey(`${e.type}-${e.key || "x"}`))
          .create({ at: FieldValue.serverTimestamp() })
          .then(() => e)
      )
    );
    for (const r of results) if (r.status === "fulfilled") bump(r.value.type, r.value.key);

    if (Object.keys(stats).length) {
      await store
        .collection("bookStats")
        .doc(BOOK_ID)
        .set({ ...stats, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    }
  } catch (error) {
    console.error("Book insights write failed", error);
  }

  const res = new NextResponse(null, { status: 204 });
  if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
  return res;
}

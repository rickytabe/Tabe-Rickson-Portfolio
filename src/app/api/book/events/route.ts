import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import {
  cleanRef,
  dayKey,
  db,
  fieldKey,
  insightsEnabled,
  INVITE_REF,
  newReaderId,
  readerCookie,
  readerFromRequest,
  sameOrigin,
} from "@/lib/insights/server";
import { bookFrom, scoped, type BookInfo } from "@/lib/books";
import { creditInvite, INVITE_READS } from "@/lib/unlock";

// Every metric counts unique readers: an event is counted the first time a reader sends it.
function eventRules(book: BookInfo): Record<string, (key: string) => boolean> {
  const sections = new Set(book.sections);
  return {
    reach: (k) => sections.has(k), // reached a chapter (CSC207) or a question (CSC211)
    end: (k) => k === "", // reached the end of the book
    support_shown: (k) => ["timer", "fab", "sidebar", "footer", "download", "quiz", "inline"].includes(k),
    tip_start: (k) => ["200", "500", "1000"].includes(k), // tapped "Support with … FCFA" (Fapshi)
    tip_return: (k) => k === "", // came back from the tip checkout
    download_free: (k) => k === "", // "I'd love to support, but..." download
    download_supported: (k) => k === "", // downloaded from the thank-you screen
    download_direct: (k) => k === "", // returning supporter, no prompt
    figure_open: (k) => k === "",
    quiz_open: (k) => ["", "fab", "sidebar", "link"].includes(k), // where the reader opened Algo from
    quiz_share: (k) => k === "", // tapped "Challenge a classmate"
    // Paid books: the unlock funnel.
    unlock_shown: (k) => ["inline", "fab", "sidebar", "footer", "quiz"].includes(k), // opened the unlock sheet
    pay_start: (k) => k === "", // tapped Pay (instant Mobile Money checkout)
    pay_return: (k) => k === "", // came back from the checkout page
    invite_share: (k) => ["whatsapp", "copy"].includes(k), // shared their invite link
    unlock_thanks: (k) => k === "", // saw the thank-you after unlocking
    // Older pages sent these; attempt-level quiz numbers are now counted on the server.
    quiz_finish: (k) => /^s([0-9]|10)$/.test(k),
    quiz_miss: (k) => /^q\d{1,3}$/.test(k),
  };
}

type Incoming = { events?: { type?: unknown; key?: unknown }[]; ref?: unknown; book?: unknown };

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

  const book = bookFrom(body.book);
  const rules = eventRules(book);
  const events = (body.events ?? [])
    .slice(0, 40)
    .map((e) => ({ type: String(e.type ?? ""), key: String(e.key ?? "") }))
    .filter((e) => rules[e.type]?.(e.key));

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
      // Invite links (?ref=i-<code>) are counted together, and remember who sent the reader.
      const invite = ref ? INVITE_REF.exec(ref)?.[1] : undefined;
      const inviter = invite ? (await store.collection("inviteCodes").doc(invite).get()).data()?.rid : undefined;
      await reader.set({
        book: book.id,
        firstSeen: FieldValue.serverTimestamp(),
        ref: invite ? "invite" : (ref ?? null),
        ...(inviter ? { invitedBy: { [book.id]: inviter } } : {}),
      });
      bump("readers", "total");
      bump("refs", invite ? "invite" : (ref ?? "direct"));
      bump("daily", dayKey());
    }

    // A mark document per reader and event: create() fails if it exists, so each counts once.
    const results = await Promise.allSettled(
      events.map((e) =>
        reader
          .collection("marks")
          .doc(fieldKey(scoped(book, `${e.type}-${e.key || "x"}`)))
          .create({ at: FieldValue.serverTimestamp() })
          .then(() => e)
      )
    );
    let newReaches = 0;
    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      bump(r.value.type, r.value.key);
      if (r.value.type === "reach") newReaches += 1;
    }

    if (Object.keys(stats).length) {
      await store
        .collection("bookStats")
        .doc(book.id)
        .set({ ...stats, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    }

    // Paid books: an invited reader counts for the friend who sent them once they have actually
    // read a few questions, not just opened the link.
    if (book.paywall && newReaches) {
      const after = await store.runTransaction(async (tx) => {
        const data = (await tx.get(reader)).data() ?? {};
        const reads = Number(data.reads?.[book.id] ?? 0) + newReaches;
        tx.set(reader, { reads: { [book.id]: reads } }, { merge: true });
        return { reads, inviter: data.invitedBy?.[book.id] as string | undefined, credited: !!data.inviteCredited?.[book.id] };
      });
      if (after.inviter && !after.credited && after.reads >= INVITE_READS && after.inviter !== rid) {
        await creditInvite(book, after.inviter, rid);
      }
    }
  } catch (error) {
    console.error("Book insights write failed", error);
  }

  const res = new NextResponse(null, { status: 204 });
  if (isNew) res.headers.set("Set-Cookie", readerCookie(rid));
  return res;
}

import { FieldValue } from "firebase-admin/firestore";
import { Resend } from "resend";
import { adminDb } from "@/lib/firebase/admin";
import { BOOK_IDS, BOOKS, type BookId, type BookInfo } from "@/lib/books";
import {
  emailKey,
  escapeHtml,
  LIST_FROM,
  loadRecipients,
  sendToList,
  SITE,
  unsubscribeUrl,
  type ListEmail,
} from "@/lib/mailing";

/*
 * "A new book is out" emails. Books ship as code, not as database entries, so the list of books
 * is BOOKS itself: any book there that has no `bookAnnouncements/{id}` doc yet is waiting to be
 * announced, and the dashboard offers to send it. Tabe sends it by hand, after checking the live
 * page, and a book is only ever announced once (the doc is claimed in a transaction first, and
 * every batch sent is recorded, so a retry after a failure only emails the people not reached).
 */

/** Books that were already out before announcements existed. Not offered as new; still sendable. */
export const LAUNCHED_BEFORE_ANNOUNCEMENTS: readonly BookId[] = [
  "csc207",
  "csc211",
  "csc207t",
  "csc207test1",
  "csc207ca24",
  "csc205",
  "csc205ca",
  "csc211ca",
];

export type AnnouncementStatus = "sending" | "sent" | "failed" | "skipped";
export type Announcement = {
  book: BookId;
  status: AnnouncementStatus;
  blurb: string;
  sentCount: number;
  total: number;
  startedAt: Date | null;
  sentAt: Date | null;
  error: string | null;
};

const COLLECTION = "bookAnnouncements";
/** A send that has not finished after this long is treated as stopped and can be resumed. */
const STALE_MS = 10 * 60 * 1000;
/** Short form of a recipient key, enough to tell who already got this email. */
const short = (key: string) => key.slice(0, 20);

function db() {
  return adminDb as FirebaseFirestore.Firestore;
}

export function bookLink(book: BookInfo): string {
  return `${book.shortLink}?ref=email`;
}

/** The email. A pure announcement: what the book is and the link, no free or paid details. */
export function announcementEmail(book: BookInfo, blurb: string, firstName: string, unsubscribe: string): ListEmail {
  const link = bookLink(book);
  const image = `${SITE}${book.path}/opengraph-image`;
  const hi = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi,";
  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f4f1ea;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#20242B;line-height:1.55;">
    <p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#15847B;font-weight:700;">New book</p>
    <h1 style="margin:0 0 20px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.2;font-weight:700;">${escapeHtml(book.title)}</h1>
    <a href="${link}" style="display:block;margin:0 0 24px;"><img src="${image}" width="520" alt="${escapeHtml(book.title)}" style="display:block;width:100%;height:auto;border-radius:10px;border:1px solid #e2ddd2;" /></a>
    <p style="margin:0 0 14px;font-size:16px;">${hi}</p>
    <p style="margin:0 0 14px;font-size:16px;">I just published <strong>${escapeHtml(book.title)}</strong>. ${escapeHtml(blurb)}</p>
    <p style="margin:24px 0 28px;"><a href="${link}" style="display:inline-block;padding:12px 22px;background:#20242B;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:600;font-size:15px;">Open the book</a></p>
    <p style="margin:0;font-size:15px;">Tabe</p>
    <hr style="border:none;border-top:1px solid #e2ddd2;margin:32px 0 16px;" />
    <p style="margin:0;font-size:12px;color:#6b6f76;">You get this because you signed up at taberickson.com. <a href="${unsubscribe}" style="color:#6b6f76;">Unsubscribe</a></p>
  </div>
</body></html>`;
  const text = `${firstName ? `Hi ${firstName},` : "Hi,"}

I just published ${book.title}. ${blurb}

Open the book: ${link}

Tabe

--
You get this because you signed up at taberickson.com.
Unsubscribe: ${unsubscribe}`;
  return { subject: `New: ${book.title}`, html, text };
}

function fromDoc(id: BookId, d: FirebaseFirestore.DocumentData): Announcement {
  return {
    book: id,
    status: d.status,
    blurb: d.blurb ?? "",
    sentCount: Number(d.sentCount ?? 0),
    total: Number(d.total ?? 0),
    startedAt: d.startedAt?.toDate?.() ?? null,
    sentAt: d.sentAt?.toDate?.() ?? null,
    error: d.error ?? null,
  };
}

export async function listAnnouncements(): Promise<Partial<Record<BookId, Announcement>>> {
  const snap = await db().collection(COLLECTION).get();
  const out: Partial<Record<BookId, Announcement>> = {};
  for (const doc of snap.docs) {
    if (doc.id in BOOKS) out[doc.id as BookId] = fromDoc(doc.id as BookId, doc.data());
  }
  return out;
}

/** New books that have not been announced (or skipped) yet, newest first. */
export function pendingBooks(done: Partial<Record<BookId, Announcement>>): BookInfo[] {
  return BOOK_IDS.filter((id) => !LAUNCHED_BEFORE_ANNOUNCEMENTS.includes(id))
    .filter((id) => !done[id] || done[id]!.status === "failed" || done[id]!.status === "sending")
    .map((id) => BOOKS[id])
    .reverse();
}

export async function recipientCount(): Promise<number> {
  return (await loadRecipients()).length;
}

/** One copy to Tabe, exactly as subscribers will see it. Records nothing. */
export async function sendTest(book: BookInfo, blurb: string, to: string): Promise<void> {
  const mail = announcementEmail(book, blurb, "Tabe", unsubscribeUrl(to));
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: LIST_FROM,
    to,
    subject: `[Test] ${mail.subject}`,
    html: mail.html,
    text: mail.text,
  });
  if (error) throw new Error(error.message ?? "Resend rejected the test email");
}

export type AnnounceResult =
  | { ok: true; sent: number; total: number }
  | { ok: false; reason: "already" | "busy" | "empty" | "failed"; message?: string };

/** Mark a book as not to be announced, so the dashboard stops offering it. */
export async function skipAnnouncement(book: BookInfo): Promise<boolean> {
  const ref = db().collection(COLLECTION).doc(book.id);
  return db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists && snap.data()?.status !== "failed") return false;
    tx.set(ref, { status: "skipped", skippedAt: FieldValue.serverTimestamp() }, { merge: true });
    return true;
  });
}

/** Email everyone on the list about a book, once. Safe to call again after a failure: it resumes. */
export async function announceBook(book: BookInfo, blurb: string): Promise<AnnounceResult> {
  const ref = db().collection(COLLECTION).doc(book.id);

  // Claim the announcement. Every read happens before any write in the transaction.
  const claim = await db().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const d = snap.data();
    if (d?.status === "sent" || d?.status === "skipped") return { ok: false as const, reason: "already" as const };
    const started = d?.startedAt?.toDate?.() as Date | undefined;
    if (d?.status === "sending" && started && Date.now() - started.getTime() < STALE_MS) {
      return { ok: false as const, reason: "busy" as const };
    }
    tx.set(
      ref,
      { status: "sending", blurb, startedAt: FieldValue.serverTimestamp(), error: null },
      { merge: true },
    );
    return { ok: true as const, sentKeys: new Set<string>((d?.sentKeys as string[] | undefined) ?? []) };
  });
  if (!claim.ok) return claim;

  try {
    const everyone = await loadRecipients();
    const todo = everyone.filter((r) => !claim.sentKeys.has(short(emailKey(r.email))));
    if (everyone.length === 0) {
      await ref.set({ status: "failed", error: "No subscribers yet" }, { merge: true });
      return { ok: false, reason: "empty" };
    }
    await ref.set({ total: everyone.length }, { merge: true });

    await sendToList(todo, (r, unsub) => announcementEmail(book, blurb, r.firstName, unsub), {
      idempotencyPrefix: `announce|${book.id}`,
      onBatch: async (keys) => {
        await ref.set(
          {
            sentKeys: FieldValue.arrayUnion(...keys.map(short)),
            sentCount: FieldValue.increment(keys.length),
          },
          { merge: true },
        );
      },
    });

    await ref.set({ status: "sent", sentAt: FieldValue.serverTimestamp() }, { merge: true });
    const final = (await ref.get()).data();
    return { ok: true, sent: Number(final?.sentCount ?? todo.length), total: everyone.length };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[announce] ${book.id} stopped:`, message);
    await ref.set({ status: "failed", error: message.slice(0, 300) }, { merge: true });
    return { ok: false, reason: "failed", message };
  }
}

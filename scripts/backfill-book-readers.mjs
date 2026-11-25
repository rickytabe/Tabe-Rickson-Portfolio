// One-off repair: recount each book's Readers from what readers actually did.
//
// Until the fix, a reader was counted only in the first book they ever opened. Readers who came
// from another book never showed up in a later book's Readers, while their chapter, finish and
// download marks did (hence "Finished the book: 300%"). This rebuilds `bookStats/{book}.readers.total`
// as the number of distinct readers with any activity in that book, and writes each reader's
// per-book "reader" mark so the live counter does not count them a second time.
//
// Dry run (reads only, changes nothing):   node --env-file=.env.local scripts/backfill-book-readers.mjs
// Apply:                                    node --env-file=.env.local scripts/backfill-book-readers.mjs --apply
// Against the emulator: set FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 first.
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const APPLY = process.argv.includes("--apply");
// Book ids with a key prefix; CSC207 Made Easy's keys have none. Longest first, so "csc207test1-"
// is matched before "csc207t-".
const PREFIXED = ["csc207test1", "csc207ca24", "csc207t", "csc211", "csc205"];
const ALL = ["csc207", ...PREFIXED];

if (!getApps().length) {
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY ?? "").replace(/\\n/g, "\n");
  initializeApp(
    process.env.FIRESTORE_EMULATOR_HOST
      ? { projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "demo" }
      : {
          credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
          }),
        }
  );
}
const db = getFirestore();

const bookOfMark = (key) => PREFIXED.find((id) => key.startsWith(`${id}-`)) ?? "csc207";
const readerMarkId = (book) => (book === "csc207" ? "reader" : `${book}-reader`);

const perBook = Object.fromEntries(ALL.map((id) => [id, new Set()]));
const readers = await db.collection("bookReaders").get();
for (const doc of readers.docs) {
  const first = doc.get("book") ?? "csc207";
  if (perBook[first]) perBook[first].add(doc.id);
}
const marks = await db.collectionGroup("marks").get();
const hasMark = new Set();
for (const m of marks.docs) {
  const rid = m.ref.parent.parent?.id;
  if (!rid || m.ref.parent.parent.parent.id !== "bookReaders") continue;
  hasMark.add(`${rid}/${m.id}`);
  const book = bookOfMark(m.id);
  perBook[book]?.add(rid);
}

console.log(`${readers.size} people (reader ids), ${marks.size} marks${APPLY ? "" : "  (dry run: nothing written)"}`);
console.log("book          now  recounted");
for (const id of ALL) {
  const stats = (await db.collection("bookStats").doc(id).get()).data() ?? {};
  const now = Number(stats.readers?.total ?? 0);
  console.log(`${id.padEnd(12)} ${String(now).padStart(4)}  ${String(perBook[id].size).padStart(9)}`);
}

if (APPLY) {
  let writes = 0;
  let batch = db.batch();
  const flush = async () => {
    if (writes % 400 === 0 && writes) {
      await batch.commit();
      batch = db.batch();
    }
  };
  for (const id of ALL) {
    for (const rid of perBook[id]) {
      const key = readerMarkId(id);
      if (hasMark.has(`${rid}/${key}`)) continue;
      batch.set(db.collection("bookReaders").doc(rid).collection("marks").doc(key), { at: FieldValue.serverTimestamp(), backfill: true });
      writes += 1;
      await flush();
    }
    batch.set(db.collection("bookStats").doc(id), { readers: { total: perBook[id].size } }, { merge: true });
    writes += 1;
    await flush();
  }
  await batch.commit();
  console.log(`applied: ${writes} writes`);
}

"use client";

/*
 * Anonymous reading stats for the book. Events are batched, sent one request at a time (so the
 * first response can set the reader cookie before the next request), and flushed with
 * sendBeacon when the page is hidden. The server counts each event once per reader.
 * Shared by every book: the reader calls setBook() first.
 */

const ENDPOINT = "/api/book/events";

let book = "csc207";

/** Which book this page is (sent with every event and feedback). */
export function setBook(id: string) {
  book = id;
}

/** The book set by setBook(), for other modules that talk to the server. */
export function currentBook() {
  return book;
}

/** Wait for a pending first request, which may be setting the reader cookie. */
export function settled() {
  return inFlight;
}

let queue: { type: string; key: string }[] = [];
const seen = new Set<string>();
let timer: ReturnType<typeof setTimeout> | null = null;
let inFlight: Promise<unknown> = Promise.resolve();
let listening = false;

/** Where the reader came from: ?ref= on the link (e.g. ?ref=l2-whatsapp), else the referring site. */
function getRef(): string | null {
  try {
    const REF_KEY = `${book}-ref`;
    const stored = sessionStorage.getItem(REF_KEY);
    if (stored) return stored;
    const fromUrl = new URLSearchParams(location.search).get("ref");
    let ref = fromUrl;
    if (!ref && document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host && host !== location.hostname.replace(/^www\./, "")) ref = host;
    }
    if (ref) sessionStorage.setItem(REF_KEY, ref);
    return ref;
  } catch {
    return null;
  }
}

function payload() {
  const body = JSON.stringify({ events: queue, ref: getRef(), book });
  queue = [];
  return body;
}

function flush() {
  timer = null;
  if (!queue.length) return;
  const body = payload();
  inFlight = inFlight.then(() =>
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => undefined)
  );
}

function flushOnLeave() {
  if (!queue.length) return;
  const body = payload();
  if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "application/json" }))) return;
  fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(
    () => undefined
  );
}

/** Record that this reader did something (counted once per reader). */
export function track(type: string, key = "") {
  if (typeof window === "undefined") return;
  const id = `${type}:${key}`;
  if (seen.has(id)) return;
  seen.add(id);
  queue.push({ type, key });
  if (!listening) {
    listening = true;
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") flushOnLeave();
    });
    window.addEventListener("pagehide", flushOnLeave);
  }
  if (!timer) timer = setTimeout(flush, 1500);
}

/** "Was this chapter clear?" */
export async function sendFeedback(chapter: string, vote: "up" | "down", text = ""): Promise<boolean> {
  try {
    await inFlight; // let a pending first request set the reader cookie
    const res = await fetch("/api/book/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chapter, vote, text, book }),
      credentials: "same-origin",
    });
    return res.ok || res.status === 204;
  } catch {
    return false;
  }
}

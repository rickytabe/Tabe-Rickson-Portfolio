import { createHash, createHmac, timingSafeEqual } from "crypto";

/*
 * Owner-only access to the insights dashboard. One password, kept in INSIGHTS_PASSWORD on the
 * server. Logging in sets a signed, HttpOnly session cookie. The signing key includes the
 * password, so changing the password ends every session.
 */

export const ADMIN_COOKIE = "bk_admin";
const SESSION_DAYS = 30;

function password(): string | null {
  const p = process.env.INSIGHTS_PASSWORD;
  return p && p.length >= 8 ? p : null;
}

export function dashboardEnabled(): boolean {
  return password() !== null;
}

function key(): string {
  const base = process.env.INSIGHTS_SECRET || process.env.FIREBASE_PRIVATE_KEY || "";
  return createHash("sha256").update(`book-insights-admin|${base}|${password()}`).digest("hex");
}

function sig(value: string): string {
  return createHmac("sha256", key()).update(value).digest("base64url");
}

function equal(a: string, b: string): boolean {
  // Compare fixed-length digests so neither length nor content leaks through timing.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(attempt: string): boolean {
  const p = password();
  return p !== null && equal(attempt, p);
}

export function sessionCookie(): string {
  const exp = String(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${ADMIN_COOKIE}=${exp}.${sig(exp)}; Path=/; Max-Age=${SESSION_DAYS * 24 * 60 * 60}; HttpOnly; SameSite=Strict${secure}`;
}

export function clearedCookie(): string {
  return `${ADMIN_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`;
}

export function validSession(value: string | undefined): boolean {
  if (!value || !dashboardEnabled()) return false;
  const [exp, s] = value.split(".");
  if (!exp || !s || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return equal(s, sig(exp));
}

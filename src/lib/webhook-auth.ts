import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

/*
 * Shared check for the Sanity webhooks. Sanity sends `Authorization: Bearer <secret>`, and the
 * secret lives only in SANITY_WEBHOOK_SECRET on the server. If the secret is missing the routes
 * refuse every request, so a forgotten env var can never leave them open.
 */

function equal(a: string, b: string): boolean {
  // Compare fixed-length digests so neither length nor content leaks through timing.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

/** Returns a response to send back if the request is not allowed, or null if it is. */
export function rejectUnlessSanityWebhook(req: Request): NextResponse | null {
  const secret = process.env.SANITY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("SANITY_WEBHOOK_SECRET is not set; refusing webhook request.");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const header = req.headers.get("authorization") ?? "";
  if (!equal(header, `Bearer ${secret}`)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, NEW_CODE_COOKIE, validSession } from "@/lib/insights/admin-auth";
import { insightsEnabled, sameOrigin } from "@/lib/insights/server";
import { bookFrom } from "@/lib/books";
import { createCode, revokeCode } from "@/lib/unlock";

/**
 * Make an unlock code for a student who paid ({ book, note }), or switch one off or on
 * ({ book, id, revoked }). Owner only (dashboard session), same origin only. A new code is shown
 * once on the dashboard through a one-minute cookie, so it never sits in a URL or the history.
 */
export async function POST(request: Request) {
  if (!insightsEnabled()) return new NextResponse(null, { status: 404 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const jar = await cookies();
  if (!validSession(jar.get(ADMIN_COOKIE)?.value)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const book = bookFrom(form?.get("book"));
  if (!book.paywall || book.paywall.codes === false) {
    return NextResponse.json({ error: "This book has no unlock codes" }, { status: 400 });
  }
  const back = NextResponse.redirect(new URL(`/book-insights?book=${book.id}#codes`, request.url), 303);

  const id = String(form?.get("id") ?? "");
  if (id) {
    await revokeCode(id, form?.get("revoked") === "1");
    return back;
  }

  const note = String(form?.get("note") ?? "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim();
  const code = await createCode(book, note);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  back.headers.set(
    "Set-Cookie",
    `${NEW_CODE_COOKIE}=${encodeURIComponent(`${code}|${note.slice(0, 40)}`)}; Path=/book-insights; Max-Age=60; HttpOnly; SameSite=Strict${secure}`
  );
  return back;
}

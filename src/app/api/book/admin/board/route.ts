import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validSession } from "@/lib/insights/admin-auth";
import { db, insightsEnabled, sameOrigin } from "@/lib/insights/server";

/** Hide or show a leaderboard entry. Owner only (dashboard session), same origin only. */
export async function POST(request: Request) {
  if (!insightsEnabled()) return new NextResponse(null, { status: 404 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const jar = await cookies();
  if (!validSession(jar.get(ADMIN_COOKIE)?.value)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const id = String(form?.get("id") ?? "");
  const hidden = form?.get("hidden") === "1";
  if (!/^w\d{4}-\d{2}_[0-9a-f-]{36}$/.test(id)) return NextResponse.json({ error: "Bad request" }, { status: 400 });

  const ref = db().collection("quizBoard").doc(id);
  if ((await ref.get()).exists) await ref.update({ hidden });
  return NextResponse.redirect(new URL("/book-insights#leaderboard", request.url), 303);
}

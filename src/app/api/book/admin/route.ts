import { NextResponse } from "next/server";
import { checkPassword, clearedCookie, dashboardEnabled, sessionCookie } from "@/lib/insights/admin-auth";
import { sameOrigin } from "@/lib/insights/server";

const DASHBOARD = "/book-insights";

/** Log in to (or out of) the insights dashboard. Form posts only, same origin only. */
export async function POST(request: Request) {
  if (!dashboardEnabled()) return new NextResponse(null, { status: 404 });
  if (!sameOrigin(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await request.formData().catch(() => null);
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url), 303);

  if (form?.get("action") === "logout") {
    const res = to(DASHBOARD);
    res.headers.set("Set-Cookie", clearedCookie());
    return res;
  }

  const attempt = String(form?.get("password") ?? "").slice(0, 200);
  if (!checkPassword(attempt)) {
    // Slow every wrong guess down.
    await new Promise((r) => setTimeout(r, 900));
    return to(`${DASHBOARD}?e=1`);
  }
  const res = to(DASHBOARD);
  res.headers.set("Set-Cookie", sessionCookie());
  return res;
}

import { NextResponse } from "next/server";
import { fapshiEnabled, settlePayment, webhookSecretOk } from "@/lib/fapshi";
import { insightsEnabled } from "@/lib/insights/server";

/**
 * Fapshi webhook: called once when a payment becomes SUCCESSFUL, FAILED or EXPIRED. Requests must
 * carry our x-wh-secret. The body is only used for the transaction id: the status is fetched from
 * Fapshi before anything is unlocked.
 */
export async function POST(request: Request) {
  if (!insightsEnabled() || !fapshiEnabled()) return new NextResponse(null, { status: 503 });
  if (!webhookSecretOk(request.headers.get("x-wh-secret"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as { transId?: unknown };
  const transId = typeof body.transId === "string" ? body.transId : "";
  try {
    const status = await settlePayment(transId);
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error("Fapshi webhook failed", error);
    return NextResponse.json({ error: "Could not process" }, { status: 500 });
  }
}

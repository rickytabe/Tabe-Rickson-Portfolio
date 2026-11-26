import { NextResponse } from "next/server";
import { Resend } from "resend";

// Contact and project-inquiry forms. Sent server-side through Resend
// (taberickson.com is a verified sender), so the form only shows success
// when the email was really accepted. This replaced FormSubmit, which said
// "success" while the messages never reached the inbox.

const TO = "rickytabe2@gmail.com";
const FROM = "Portfolio Contact <hello@taberickson.com>";

const KINDS = {
  message: "New Message — Portfolio",
  project: "New Project Inquiry — Portfolio",
} as const;

// Fields each form may send, with their label in the email and a length cap.
const FIELDS: Record<string, { label: string; max: number }> = {
  name: { label: "Name", max: 120 },
  email: { label: "Email", max: 200 },
  whatsapp: { label: "WhatsApp", max: 40 },
  phone: { label: "WhatsApp / Phone", max: 40 },
  project_type: { label: "Project type", max: 60 },
  budget: { label: "Budget", max: 60 },
  timeline: { label: "Timeline", max: 60 },
  message: { label: "Message", max: 5000 },
  details: { label: "Project details", max: 5000 },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real people never fill this hidden field. Pretend it worked.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const kind = body.kind === "project" ? "project" : "message";
  const fields: Record<string, string> = {};
  for (const [key, { max }] of Object.entries(FIELDS)) {
    const v = body[key];
    if (typeof v === "string" && v.trim()) fields[key] = v.trim().slice(0, max);
  }

  const text = fields.message ?? fields.details;
  if (!fields.name || !fields.email || !text) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email and message." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(fields.email)) {
    return NextResponse.json(
      { ok: false, error: "That email address doesn't look right." },
      { status: 400 },
    );
  }

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { ok: false, error: "The form isn't set up right now." },
      { status: 503 },
    );
  }

  const rows = Object.entries(fields)
    .map(
      ([key, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #ddd;background:#f6f6f6;font-weight:600;vertical-align:top;white-space:nowrap">${FIELDS[key].label}</td>` +
        `<td style="padding:8px 12px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const plain = Object.entries(fields)
    .map(([key, value]) => `${FIELDS[key].label}: ${value}`)
    .join("\n\n");

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: fields.email,
      subject: `${KINDS[kind]}: ${fields.name}`,
      html: `<div style="font-family:sans-serif;font-size:14px;color:#222"><h2 style="margin:0 0 16px">${KINDS[kind]}</h2><table style="border-collapse:collapse">${rows}</table><p style="color:#888;font-size:12px;margin-top:16px">Reply to this email to answer ${escapeHtml(fields.name)} directly.</p></div>`,
      text: plain,
    });
    if (error) {
      console.error("[contact] Resend rejected the email:", error);
      return NextResponse.json(
        { ok: false, error: "Your message couldn't be sent." },
        { status: 502 },
      );
    }
    console.log("[contact] sent", kind, data?.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Your message couldn't be sent." },
      { status: 502 },
    );
  }
}

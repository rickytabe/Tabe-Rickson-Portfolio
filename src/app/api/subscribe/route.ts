import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Newsletter sign-up. Returns ok only when both emails were accepted by
// Resend: the notification to Tabe (sent first, so a failure leaves nothing
// half-done for the reader) and the welcome email to the subscriber.

const FROM = 'Tabe Rickson <hello@taberickson.com>';
const NOTIFY = 'rickytabe2@gmail.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  let body: { email?: unknown; firstName?: unknown };
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request.', 400);
  }

  const email = typeof body.email === 'string' ? body.email.trim().slice(0, 200) : '';
  const firstName = typeof body.firstName === 'string' ? body.firstName.trim().slice(0, 80) : '';
  if (!email || !firstName) return fail('Please enter your first name and email.', 400);
  if (!EMAIL_RE.test(email)) return fail("That email address doesn't look right.", 400);

  if (!process.env.RESEND_API_KEY) {
    console.error('[subscribe] RESEND_API_KEY is not set');
    return fail("Sign-up isn't available right now.", 503);
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeName = escapeHtml(firstName);
  const safeEmail = escapeHtml(email);

  try {
    // 1. Tell Tabe about the new subscriber.
    const notification = await resend.emails.send({
      from: FROM,
      to: NOTIFY,
      replyTo: email,
      subject: `🎉 New Newsletter Subscriber: ${firstName}`,
      html: `
        <div style="font-family: sans-serif;">
          <h2>New Subscriber Alert!</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
        </div>
      `,
      text: `New subscriber\n\nName: ${firstName}\nEmail: ${email}`,
    });
    if (notification.error) {
      console.error('[subscribe] notification rejected:', notification.error);
      return fail("We couldn't sign you up just now.", 502);
    }

    // 2. Welcome the subscriber.
    const welcome = await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Hey ${firstName}, great to connect!`,
      html: `
        <div style="background-color: #121212; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e5e5e5; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; padding: 40px; border-radius: 8px; border-top: 4px solid #39FF14;">
            
            <p style="font-size: 18px; color: #ffffff; margin-bottom: 24px;">Hi ${safeName},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Thanks for dropping by and connecting. I'm excited to share this space with you.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              I'll shoot you a quick note whenever I share new thoughts on software engineering or host an upcoming session. No spam, just things I genuinely think you'll find valuable.
            </p>
            
            <p style="font-size: 16px; margin-bottom: 32px;">
              Feel free to reply to this email anytime if you want to chat—I read them all.
            </p>
            
            <hr style="border: none; border-top: 1px solid #333333; margin-bottom: 24px;" />
            
            <p style="font-size: 14px; color: #888888; margin: 0;">
              Best,<br/>
              <strong style="color: #ffffff; font-size: 16px;">Tabe Rickson</strong>
            </p>
            
            <p style="font-size: 12px; color: #39FF14; margin-top: 16px; letter-spacing: 1px; text-transform: uppercase;">
              Software Engineer & Builder
            </p>
            
          </div>
        </div>
      `,
    });
    if (welcome.error) {
      console.error('[subscribe] welcome email rejected:', welcome.error);
      return fail("We couldn't send the welcome email to that address.", 502);
    }

    console.log('[subscribe] ok', notification.data?.id, welcome.data?.id);
    return NextResponse.json({ ok: true, success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('[subscribe] send failed:', error);
    return fail("We couldn't sign you up just now.", 502);
  }
}

import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, firstName } = await req.json();

    if (!email || !firstName) {
      return NextResponse.json({ error: 'Email and firstName are required' }, { status: 400 });
    }

    // 1. Send Welcome Email via Resend
    // We assume hello@taberickson.com is verified on Resend.
    const resendResult = await resend.emails.send({
      from: 'Tabe Rickson <hello@taberickson.com>',
      to: email,
      subject: `Hey ${firstName}, great to connect!`,
      html: `
        <div style="background-color: #121212; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e5e5e5; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; padding: 40px; border-radius: 8px; border-top: 4px solid #39FF14;">
            
            <p style="font-size: 18px; color: #ffffff; margin-bottom: 24px;">Hi ${firstName},</p>
            
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

    if (resendResult.error) {
      console.error('Resend Error:', resendResult.error);
    }

    // 2. Send Notification to you via Resend (Much more reliable than FormSubmit for server-to-server)
    const notificationResult = await resend.emails.send({
      from: 'Tabe Rickson <hello@taberickson.com>',
      to: 'rickytabe2@gmail.com',
      subject: '🎉 New Newsletter Subscriber!',
      html: `
        <div style="font-family: sans-serif;">
          <h2>New Subscriber Alert!</h2>
          <p><strong>Name:</strong> ${firstName}</p>
          <p><strong>Email:</strong> ${email}</p>
        </div>
      `,
    });

    if (notificationResult.error) {
      console.error('Notification Error:', notificationResult.error);
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Subscribe Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

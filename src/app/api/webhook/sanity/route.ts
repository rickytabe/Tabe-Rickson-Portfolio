import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Basic verification - set this same secret in your Sanity Webhook HTTP Headers
    const authHeader = req.headers.get('authorization');
    const secret = process.env.NEXT_PUBLIC_SANITY_WEBHOOK_SECRET || process.env.SANITY_WEBHOOK_SECRET;
    
    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Ensure we are only triggering on post or event creation
    const { _type, title, slug, excerpt, description } = body;
    
    if (_type !== 'post' && _type !== 'event') {
       return NextResponse.json({ message: 'Ignored document type' });
    }

    // Fetch all subscribers from Firebase
    const subscribersSnapshot = await adminDb.collection('subscribers').get();
    const emails = subscribersSnapshot.docs.map((doc: any) => doc.data().email).filter(Boolean);

    if (emails.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    const typeName = _type === 'post' ? 'Blog Post' : 'Event';
    // Fallback excerpt handling
    const snippet = excerpt || description || 'Check out the latest update on the site.';
    
    const linkUrl = _type === 'post' 
      ? `https://taberickson.com/blog/${slug?.current || ''}` 
      : `https://taberickson.com/events`;

    // Send email via Resend
    // Resend allows up to 50 BCCs per request. We batch them.
    const BATCH_SIZE = 50;
    for (let i = 0; i < emails.length; i += BATCH_SIZE) {
      const batch = emails.slice(i, i + BATCH_SIZE);
      await resend.emails.send({
        // NOTE: You MUST verify the domain taberickson.com in Resend to send from it.
        from: 'Tabe Rickson <hello@taberickson.com>',
        to: ['hello@taberickson.com'], // Primary receiver
        bcc: batch,
        subject: `New ${typeName}: ${title}`,
        html: `
          <div style="background-color: #121212; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e5e5e5; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; padding: 40px; border-radius: 8px; border-top: 4px solid #39FF14;">
              
              <p style="font-size: 16px; margin-bottom: 24px;">
                Hey there,
              </p>

              <p style="font-size: 16px; margin-bottom: 12px;">
                I just published a new ${typeName} that I thought you might find interesting.
              </p>
              
              <h3 style="font-size: 22px; color: #ffffff; margin-bottom: 12px;">${title}</h3>
              <p style="font-size: 15px; color: #a0a0a0; margin-bottom: 32px; border-left: 3px solid #333; padding-left: 16px;">
                ${snippet}
              </p>
              
              <a href="${linkUrl}" style="display: inline-block; padding: 12px 24px; background-color: #39FF14; color: #121212; text-decoration: none; font-weight: bold; font-family: monospace; letter-spacing: 1px; border-radius: 4px; text-transform: uppercase;">
                Read More
              </a>
              
              <hr style="border: none; border-top: 1px solid #333333; margin-top: 40px; margin-bottom: 24px;" />
              
              <p style="font-size: 14px; color: #888888; margin: 0;">
                Best,<br/>
                <strong style="color: #ffffff; font-size: 16px;">Tabe Rickson</strong>
              </p>
              
              <p style="font-size: 11px; color: #555; margin-top: 32px;">
                You are receiving this because you connected with me at taberickson.com. 
                If you prefer not to receive these updates, just reply to this email and let me know.
              </p>
              
            </div>
          </div>
        `
      });
    }

    return NextResponse.json({ success: true, emailsSent: emails.length });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

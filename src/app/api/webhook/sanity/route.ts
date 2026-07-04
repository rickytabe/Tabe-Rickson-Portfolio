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
        // Otherwise, it will fail, or you must use onboarding@resend.dev
        from: 'Tabe Rickson <hello@taberickson.com>',
        to: ['hello@taberickson.com'], // Primary receiver
        bcc: batch,
        subject: `New ${typeName}: ${title}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #121212; padding: 20px;">
            <h2 style="color: #121212;">I just published a new ${typeName}!</h2>
            <h3 style="font-size: 24px; margin-bottom: 10px;">${title}</h3>
            <p style="font-size: 16px; line-height: 1.6; color: #444;">${snippet}</p>
            <br/>
            <a href="${linkUrl}" style="display:inline-block;padding:12px 24px;background-color:#39FF14;color:#121212;text-decoration:none;font-weight:bold;border-radius:4px;text-transform:uppercase;letter-spacing:1px;">
              View ${typeName}
            </a>
            <hr style="margin-top: 40px; border: none; border-top: 1px solid #eee;" />
            <p style="font-size: 12px; color: #999;">You are receiving this because you subscribed to updates at taberickson.com.</p>
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

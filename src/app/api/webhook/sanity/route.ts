import { NextResponse } from 'next/server';
import { rejectUnlessSanityWebhook } from '@/lib/webhook-auth';
import { escapeHtml, loadRecipients, mailingEnabled, sendToList } from '@/lib/mailing';

export async function POST(req: Request) {
  try {
    // Only Sanity, holding SANITY_WEBHOOK_SECRET, may trigger emails to subscribers.
    const rejected = rejectUnlessSanityWebhook(req);
    if (rejected) return rejected;

    const body = await req.json();
    
    // Ensure we are only triggering on post or event creation
    const { _type, title, slug, excerpt, description } = body;
    
    if (_type !== 'post' && _type !== 'event') {
       return NextResponse.json({ message: 'Ignored document type' });
    }

    if (!mailingEnabled()) {
      return NextResponse.json({ error: 'Mailing is not configured' }, { status: 503 });
    }
    // Everyone on the list, once each, without those who unsubscribed.
    const recipients = await loadRecipients();
    if (recipients.length === 0) {
      return NextResponse.json({ message: 'No subscribers found' });
    }

    const typeName = _type === 'post' ? 'Blog Post' : 'Event';
    // Fallback excerpt handling
    const snippet = excerpt || description || 'Check out the latest update on the site.';
    
    const linkUrl = _type === 'post' 
      ? `https://www.taberickson.com/blog/${slug?.current || ''}` 
      : `https://www.taberickson.com/events`;

    const safeTitle = escapeHtml(String(title ?? ''));
    const safeSnippet = escapeHtml(String(snippet));

    // One email per subscriber, each with their own unsubscribe link.
    const sent = await sendToList(
      recipients,
      (_r, unsub) => ({
        subject: `New ${typeName}: ${title}`,
        text: `I just published a new ${typeName}: ${title}

${snippet}

Read it: ${linkUrl}

Tabe Rickson

Unsubscribe: ${unsub}`,
        html: `
          <div style="background-color: #121212; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #e5e5e5; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; padding: 40px; border-radius: 8px; border-top: 4px solid #39FF14;">
              
              <p style="font-size: 16px; margin-bottom: 24px;">
                Hey there,
              </p>

              <p style="font-size: 16px; margin-bottom: 12px;">
                I just published a new ${typeName} that I thought you might find interesting.
              </p>
              
              <h3 style="font-size: 22px; color: #ffffff; margin-bottom: 12px;">${safeTitle}</h3>
              <p style="font-size: 15px; color: #a0a0a0; margin-bottom: 32px; border-left: 3px solid #333; padding-left: 16px;">
                ${safeSnippet}
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
                <a href="${unsub}" style="color: #777;">Unsubscribe</a>
              </p>
              
            </div>
          </div>
        `,
      }),
      { idempotencyPrefix: `sanity|${_type}|${slug?.current ?? title}` },
    );

    return NextResponse.json({ success: true, emailsSent: sent });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Webhook failed' }, { status: 500 });
  }
}

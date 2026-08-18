import { NextResponse } from 'next/server';

const INDEXNOW_KEY = 'cdb373bc9286433e8a4a2b9a7c645391';
const HOST_URL = 'taberickson.com';

export async function POST(req: Request) {
  try {
    // 1. Verify Webhook Secret
    const authHeader = req.headers.get('authorization');
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse the Sanity Webhook Payload
    const body = await req.json();
    
    // We expect Sanity to send the updated document. We need to extract the slug.
    // The webhook payload structure depends on how it's configured in Sanity,
    // but typically it sends the document itself.
    const slug = body?.slug?.current;
    
    if (!slug) {
      return NextResponse.json({ error: 'No slug provided in payload' }, { status: 400 });
    }

    // Determine the full URL based on the document type
    const docType = body?._type;
    let path = '';
    
    if (docType === 'post') {
      path = `/blog/${slug}`;
    } else {
      // Default fallback or if it's a project, etc.
      // You can adjust this based on your Sanity schema types
      path = `/${slug}`;
    }

    const fullUrl = `https://${HOST_URL}${path}`;

    // 3. Prepare the IndexNow Request payload
    const indexNowPayload = {
      host: HOST_URL,
      key: INDEXNOW_KEY,
      keyLocation: `https://${HOST_URL}/${INDEXNOW_KEY}.txt`,
      urlList: [fullUrl],
    };

    // 4. Send the Request to IndexNow API
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(indexNowPayload),
    });

    if (response.ok) {
      console.log(`Successfully submitted ${fullUrl} to IndexNow.`);
      return NextResponse.json({ success: true, message: 'URL submitted to IndexNow' }, { status: 200 });
    } else {
      const errorText = await response.text();
      console.error('Failed to submit to IndexNow:', response.status, errorText);
      return NextResponse.json({ error: 'IndexNow API error', details: errorText }, { status: response.status });
    }
  } catch (error: any) {
    console.error('Error processing IndexNow webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

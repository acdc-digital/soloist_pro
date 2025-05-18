import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../convex/_generated/api';

// Create a Convex client for the API route
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = new ConvexHttpClient(convexUrl || '');

export async function POST(request: Request) {
  // Get the signature from the Stripe webhook request
  const signature = request.headers.get('stripe-signature');
  
  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }
  
  if (!convexUrl) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_CONVEX_URL environment variable' }, { status: 500 });
  }
  
  try {
    // Get the raw request body as text
    const payload = await request.text();
    
    console.log("Received webhook event, forwarding to Convex");
    
    // Forward the webhook to Convex to process
    const result = await convex.action(api.stripe.fulfill, {
      signature,
      payload
    });
    
    if (!result.success) {
      console.error("Webhook fulfillment failed:", result.error);
      return NextResponse.json({ error: result.error || 'Webhook verification failed' }, { status: 400 });
    }
    
    console.log("Webhook processed successfully");
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Error handling Stripe webhook:', error);
    return NextResponse.json({ error: error.message || 'Webhook error' }, { status: 500 });
  }
} 
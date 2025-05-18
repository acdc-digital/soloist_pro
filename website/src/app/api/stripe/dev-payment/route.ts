// DEVELOPMENT ONLY PAYMENT HELPER
// This endpoint is for development and testing only and should be excluded from production builds

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

export async function GET(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { message: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get('payment_intent_id');
  const sessionId = searchParams.get('session_id');
  const action = searchParams.get('action') || 'succeed';

  try {
    if (paymentIntentId) {
      // Get current payment intent
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (action === 'succeed') {
        // For development, we'll simulate a successful payment without requiring card details
        await stripe.paymentIntents.update(paymentIntentId, {
          metadata: {
            ...paymentIntent.metadata,
            dev_succeeded: 'true',
            dev_test: 'true'
          }
        });
        
        // Redirect to thank you page
        return NextResponse.redirect(
          new URL(`/thank-you?success=true&payment_intent_id=${paymentIntentId}`, request.url)
        );
      } else if (action === 'fail') {
        // Simulate a failed payment
        await stripe.paymentIntents.update(paymentIntentId, {
          metadata: {
            ...paymentIntent.metadata,
            dev_failed: 'true',
            dev_test: 'true'
          }
        });
        
        return NextResponse.redirect(
          new URL(`/thank-you?error=true&payment_intent_id=${paymentIntentId}`, request.url)
        );
      }
    } else if (sessionId) {
      // Get checkout session
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (action === 'succeed') {
        // Mark session as completed in dev mode
        await stripe.checkout.sessions.update(sessionId, {
          metadata: {
            ...session.metadata,
            dev_succeeded: 'true',
            dev_test: 'true'
          }
        });
        
        return NextResponse.redirect(
          new URL(`/thank-you?success=true&session_id=${sessionId}`, request.url)
        );
      } else if (action === 'fail') {
        await stripe.checkout.sessions.update(sessionId, {
          metadata: {
            ...session.metadata,
            dev_failed: 'true',
            dev_test: 'true'
          }
        });
        
        return NextResponse.redirect(
          new URL(`/thank-you?error=true&session_id=${sessionId}`, request.url)
        );
      }
    }

    return NextResponse.json(
      { message: 'Missing payment_intent_id or session_id parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Dev payment helper error:', error);
    return NextResponse.json(
      { message: 'Error processing dev payment', error: String(error) },
      { status: 500 }
    );
  }
} 
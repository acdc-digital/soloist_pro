import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil', // Use the latest API version
});

export async function GET(request: Request) {
  // Get session_id from URL
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  
  if (!sessionId) {
    return NextResponse.json(
      { message: 'Session ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent']
    });
    
    // Get payment intent if available
    const paymentIntent = session.payment_intent as Stripe.PaymentIntent | null;
    
    // Only return necessary info to the client
    return NextResponse.json({
      id: session.id,
      customer: session.customer,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email,
      created: session.created,
      status: session.status,
      // If we have a payment intent, include its ID and status
      payment_intent_id: paymentIntent?.id,
      payment_intent_status: paymentIntent?.status,
      succeeded: session.payment_status === 'paid',
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { message: 'Error retrieving checkout session', error: String(error) },
      { status: 500 }
    );
  }
} 
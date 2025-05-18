import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil', // Use the latest API version
});

export async function GET(request: Request) {
  // Get payment_intent_id from URL
  const { searchParams } = new URL(request.url);
  const paymentIntentId = searchParams.get('payment_intent_id');
  
  if (!paymentIntentId) {
    return NextResponse.json(
      { message: 'Payment intent ID is required' },
      { status: 400 }
    );
  }
  
  try {
    // Retrieve the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    // Only return necessary info to the client
    return NextResponse.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
      currency: paymentIntent.currency,
      created: paymentIntent.created,
      customer: paymentIntent.customer,
      payment_method: paymentIntent.payment_method,
      succeeded: paymentIntent.status === 'succeeded',
    });
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    return NextResponse.json(
      { message: 'Error retrieving payment intent', error: String(error) },
      { status: 500 }
    );
  }
} 
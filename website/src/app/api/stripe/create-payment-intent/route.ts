// PAYMENT INTENT API
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/app/api/stripe/create-payment-intent/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil', // Use the latest API version
});

export async function POST(request: Request) {
  try {
    // Check if Stripe API key is set
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { message: 'Stripe API key is not set' },
        { status: 500 }
      );
    }

    const { priceId, customerEmail, metadata } = await request.json();

    // Validate required parameters
    if (!priceId) {
      return NextResponse.json(
        { message: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get origin for metadata
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';
    const isSecure = origin.startsWith('https://') || process.env.NODE_ENV === 'development';
    const protocol = typeof window !== 'undefined' ? window.location.protocol : 'unknown';

    console.log('Creating payment intent:', {
      priceId,
      environment: process.env.NODE_ENV,
      isSecure,
      origin,
      customerEmail: customerEmail || 'not provided'
    });

    // Retrieve the price information from Stripe
    const price = await stripe.prices.retrieve(priceId);
    
    // Get the product details
    const product = await stripe.products.retrieve(price.product as string);

    // Create payment intent parameters
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: price.unit_amount || 0,
      currency: price.currency || 'usd',
      description: `Subscription to ${product.name}`,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        price_id: priceId,
        product_id: price.product as string,
        origin,
        environment: process.env.NODE_ENV || 'unknown',
        ...metadata
      }
    };

    // Add customer email if provided
    if (customerEmail) {
      paymentIntentParams.receipt_email = customerEmail;
    }

    // Create the payment intent
    console.log('PaymentIntent params:', JSON.stringify(paymentIntentParams, null, 2));
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);
    console.log('PaymentIntent created:', paymentIntent.id);

    // Return the payment intent client secret
    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    // Try to extract more details from Stripe errors
    let errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred creating payment intent';
    let errorDetails = {};
    
    if (error instanceof Stripe.errors.StripeError) {
      errorDetails = {
        type: error.type,
        code: error.code,
        param: error.param,
        // Stripe error message
        message: error.message
      };
      console.error('Stripe error details:', errorDetails);
    }
    
    return NextResponse.json(
      { 
        message: errorMessage, 
        details: errorDetails 
      },
      { status: 500 }
    );
  }
} 
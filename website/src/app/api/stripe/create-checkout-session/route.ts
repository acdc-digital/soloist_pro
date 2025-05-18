// CHECKOUT SESSION
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/app/api/stripe/create-checkout-session/route.ts

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
    
    const { priceId, successUrl, cancelUrl, customerEmail, metadata } = await request.json();

    // Validate required parameters
    if (!priceId) {
      return NextResponse.json(
        { message: 'Price ID is required' },
        { status: 400 }
      );
    }

    // Get origin for return URL
    const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || '';
    
    // If no explicit successUrl is provided, create one with the session ID
    const defaultSuccessUrl = `${origin}/thank-you?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const defaultCancelUrl = `${origin}/pricing?canceled=true`;

    // Create checkout session options
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || defaultSuccessUrl,
      cancel_url: cancelUrl || defaultCancelUrl,
      // We don't need to allow iframe embedding anymore since we're redirecting
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      locale: 'en', // Force English locale to avoid module loading issues
    };

    // Add customer email if provided
    if (customerEmail) {
      sessionOptions.customer_email = customerEmail;
    }

    // Add metadata if provided
    if (metadata && Object.keys(metadata).length > 0) {
      sessionOptions.metadata = {
        ...metadata,
        origin: origin,
        environment: process.env.NODE_ENV || 'unknown'
      };
    } else {
      sessionOptions.metadata = {
        origin: origin,
        environment: process.env.NODE_ENV || 'unknown'
      };
    }

    console.log('Creating checkout session with options:', {
      priceId,
      success_url: sessionOptions.success_url,
      cancel_url: sessionOptions.cancel_url,
      mode: sessionOptions.mode,
      locale: sessionOptions.locale
    });

    // Create the checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions);
    console.log('Checkout session created:', session.id);

    // Return the session ID and URL
    return NextResponse.json({ 
      sessionId: session.id,
      sessionUrl: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // Try to extract more details from Stripe errors
    let errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred creating checkout session';
    let errorDetails = {};
    
    if (error instanceof Stripe.errors.StripeError) {
      errorDetails = {
        type: error.type,
        code: error.code,
        param: error.param,
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
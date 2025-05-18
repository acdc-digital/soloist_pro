// PAYMENT INTENT API
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/app/api/stripe/create-payment-intent/route.ts

import { NextResponse } from 'next/server';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../../../../../convex/_generated/api';

// Whether to use mock responses for testing
const USE_MOCK_CHECKOUT = false; // Set to false to use real Stripe

// Create a Convex client for the API route
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const convex = new ConvexHttpClient(convexUrl || '');

export async function POST(request: Request) {
  try {
    console.log("CONVEX URL:", convexUrl);
    
    const body = await request.json();
    const { priceId, customerEmail, metadata = {} } = body;
    
    console.log("Request body:", { priceId, customerEmail: customerEmail || 'none', hasMetadata: !!metadata });
    
    if (!priceId) {
      return NextResponse.json({ error: 'Missing required parameter: priceId' }, { status: 400 });
    }
    
    if (!convexUrl) {
      return NextResponse.json({ error: 'Missing NEXT_PUBLIC_CONVEX_URL environment variable' }, { status: 500 });
    }
    
    // For testing, use a mock response
    if (USE_MOCK_CHECKOUT) {
      console.log("Using mock payment intent");
      const mockId = Date.now().toString();
      
      // Record the mock payment in the database
      try {
        await convex.mutation(api.payments.storeMockPayment, {
          userId: metadata?.userId,
          amount: 1999, // $19.99
          currency: "usd",
          paymentId: mockId,
          planType: metadata?.planType || "pro",
          email: customerEmail || 'mock@example.com' // Provide a fallback email
        });
      } catch (err) {
        console.warn("Failed to record mock payment:", err);
        // Continue anyway - mock payment recording is optional
      }
      
      return NextResponse.json({
        clientSecret: "mock_client_secret_for_testing_" + mockId,
        id: "mock_payment_intent_" + mockId,
        paymentId: "mock_payment_id_" + mockId
      });
    }
    
    // Real Convex integration for production
    try {
      // Ensure the customerEmail is not an empty string
      const emailToUse = customerEmail && customerEmail.trim() ? customerEmail : undefined;
      
      // Call Convex action to create a payment intent
      const paymentData = await convex.action(api.stripe.createPaymentIntent, {
        priceId,
        customerEmail: emailToUse,
        metadata,
        userId: metadata?.userId
      });
      
      // Return the client secret needed for Stripe Elements
      return NextResponse.json({
        clientSecret: paymentData.clientSecret,
        id: paymentData.id,
        paymentId: paymentData.paymentId
      });
    } catch (convexError: any) {
      console.error("Convex payment intent error:", convexError);
      
      // If the Stripe keys are missing or invalid, let's tell the user
      if (convexError.message?.includes("Invalid API Key")) {
        return NextResponse.json({ 
          error: "Stripe API key is invalid or missing. Please update your Stripe configuration.", 
          isStripeKeyError: true 
        }, { status: 500 });
      }
      
      // Handle email validation errors
      if (convexError.message?.includes("Invalid email address")) {
        return NextResponse.json({ 
          error: "Invalid email address provided. Please provide a valid email or leave it blank.", 
          isEmailError: true 
        }, { status: 400 });
      }
      
      throw convexError;
    }
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    
    // Return a more detailed error
    return NextResponse.json({ 
      error: error.message || 'Failed to create payment intent',
      stack: error.stack,
      convexUrl: convexUrl || 'not set'
    }, { status: 500 });
  }
} 
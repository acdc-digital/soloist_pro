// PAYMENT RETURN API ROUTE
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/app/api/stripe/payment-return/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

export async function GET(request: Request) {
  try {
    // Get the payment_intent_id from the URL
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get('payment_intent_id');

    if (!paymentIntentId) {
      return new Response(
        getReturnHtml('error', 'No payment intent ID provided'),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Verify the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if payment was successful
    if (paymentIntent.status === 'succeeded') {
      // Return HTML with JavaScript that will post a message to the parent window
      return new Response(
        getReturnHtml('success', paymentIntentId),
        { headers: { 'Content-Type': 'text/html' } }
      );
    } else {
      // Payment was not successful
      return new Response(
        getReturnHtml('error', `Payment status: ${paymentIntent.status}`),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
  } catch (error) {
    console.error('Error in payment return handler:', error);
    
    // Return HTML with error message
    return new Response(
      getReturnHtml('error', error instanceof Error ? error.message : 'An unexpected error occurred'),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }
}

function getReturnHtml(status: 'success' | 'error', message: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Processing Payment</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9f9f9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      padding: 0 20px;
      text-align: center;
    }
    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 30px;
      max-width: 500px;
      width: 100%;
    }
    .success {
      color: #10b981;
    }
    .error {
      color: #ef4444;
    }
    h1 {
      margin-top: 0;
      font-size: 24px;
    }
    p {
      color: #4b5563;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1 class="${status === 'success' ? 'success' : 'error'}">
      ${status === 'success' ? 'Payment Successful' : 'Payment Error'}
    </h1>
    <p>${status === 'success' ? 'Your payment has been processed successfully.' : message}</p>
    <p>Returning to application...</p>
  </div>

  <script>
    // Send a message to the opener window and close this one
    window.onload = function() {
      try {
        // Post message to parent window
        window.opener.postMessage('stripe-payment-completed', '*');
        // Close this window after a short delay
        setTimeout(function() {
          // If running in a new tab or window, try to close it
          window.close();
          // If we can't close (likely because we didn't open this window), redirect back
          setTimeout(function() {
            window.location.href = '/';
          }, 300);
        }, 1500);
      } catch (e) {
        console.error('Error communicating with parent window:', e);
        // Fallback to redirect after a delay
        setTimeout(function() {
          window.location.href = '/';
        }, 2000);
      }
    };
  </script>
</body>
</html>
  `;
} 
"use node";

import { v } from "convex/values";
import { action, internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import Stripe from "stripe";

// Function to initialize Stripe client
function getStripeClient() {
  const stripeKey = process.env.STRIPE_KEY || process.env.NEXT_PUBLIC_STRIPE_KEY;
  if (!stripeKey) {
    throw new Error("STRIPE_KEY environment variable not set");
  }
  return new Stripe(stripeKey, {
    apiVersion: "2022-11-15",
  });
}

// Create a checkout session that works with the existing StripeCheckout component
export const createCheckoutSession = action({
  args: { 
    priceId: v.string(),
    successUrl: v.optional(v.string()),
    cancelUrl: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    metadata: v.optional(v.any()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { 
      priceId, 
      successUrl, 
      cancelUrl, 
      customerEmail, 
      metadata = {},
      userId
    } = args;
    
    const stripe = getStripeClient();
    const domain = process.env.HOSTING_URL ?? "http://localhost:3000";
    
    // Create a payment record in our database
    const paymentId = await ctx.runMutation(internal.payments.create, {
      userId,
      amount: 0, // Will be updated after checkout completion
      currency: "USD",
      metadata: {
        ...metadata,
        priceId
      }
    });

    // Create checkout session options
    const sessionOptions = {
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl || `${domain}/payment-success?paymentId=${paymentId}`,
      cancel_url: cancelUrl || `${domain}/payment-canceled`,
      metadata: {
        ...metadata,
        paymentId: paymentId,
        userId: userId || ""
      }
    };
    
    // Only add customer_email if it's a valid non-empty string
    if (customerEmail && customerEmail.trim()) {
      Object.assign(sessionOptions, { customer_email: customerEmail });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions);

    // Keep track of the checkout session ID for fulfillment
    await ctx.runMutation(internal.payments.markPending, {
      paymentId,
      stripeId: session.id,
      stripeSessionId: session.id,
    });

    // Return full session for flexibility with the frontend
    return {
      sessionId: session.id,
      sessionUrl: session.url,
      paymentId
    };
  },
});

// Create a payment intent with Stripe Elements for modal checkout
export const createPaymentIntent = action({
  args: {
    priceId: v.string(),
    customerEmail: v.optional(v.string()),
    metadata: v.optional(v.any()),
    userId: v.optional(v.string()),
  },
  handler: async (ctx, { priceId, customerEmail, metadata = {}, userId }) => {
    const stripe = getStripeClient();
    
    // Lookup the price
    const price = await stripe.prices.retrieve(priceId);
    const amount = price.unit_amount || 0;
    const currency = price.currency || 'usd';
    
    // Create a payment record
    const paymentId = await ctx.runMutation(internal.payments.create, {
      userId,
      amount,
      currency,
      metadata: {
        ...metadata,
        priceId
      }
    });
    
    // Create payment intent options
    const paymentIntentOptions = {
      amount,
      currency,
      metadata: {
        ...metadata,
        paymentId: paymentId,
        userId: userId || "",
        priceId
      }
    };
    
    // Only add receipt_email if it's a valid non-empty string
    if (customerEmail && customerEmail.trim()) {
      Object.assign(paymentIntentOptions, { receipt_email: customerEmail });
    }
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentOptions);
    
    // Mark the payment as pending
    await ctx.runMutation(internal.payments.markPending, {
      paymentId,
      stripeId: paymentIntent.id,
      stripeSessionId: paymentIntent.id,
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      paymentId
    };
  }
});

// Function to process webhook events from Stripe
export const fulfill = internalAction({
  args: { signature: v.string(), payload: v.string() },
  handler: async (ctx, { signature, payload }) => {
    const stripe = getStripeClient();
    const webhookSecret = process.env.STRIPE_WEBHOOKS_SECRET;
    
    if (!webhookSecret) {
      throw new Error("STRIPE_WEBHOOKS_SECRET environment variable not set");
    }
    
    try {
      // Verify this is a legitimate request from Stripe
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );
      
      console.log(`Received Stripe webhook event: ${event.type}`);
      
      if (event.type === "checkout.session.completed") {
        // Handle checkout session completion
        const session = event.data.object as Stripe.Checkout.Session;
        const stripeId = session.id;
        
        // Get payment amount from Stripe session
        const amount = session.amount_total || 0;
        
        // Find payment by Stripe session ID
        await ctx.runMutation(internal.payments.fulfill, { stripeId });
        
        return { success: true };
      } else if (event.type === "payment_intent.succeeded") {
        // Handle payment intent completion (for modal checkout)
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const stripeId = paymentIntent.id;
        
        // Update our payment record
        await ctx.runMutation(internal.payments.fulfill, { stripeId });
        
        return { success: true };
      }
      
      return { success: true, message: `Unhandled event: ${event.type}` };
    } catch (err) {
      console.error("Stripe webhook error:", err);
      return { success: false, error: (err as Error).message };
    }
  },
}); 
import { v } from "convex/values";
import { mutation, internalMutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Create a new payment record
export const create = internalMutation({
  args: { 
    userId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    metadata: v.optional(v.object({
      planType: v.optional(v.string()),
      duration: v.optional(v.string()),
      features: v.optional(v.array(v.string())),
      date: v.optional(v.string()),
      plan: v.optional(v.string()),
      priceId: v.optional(v.string()),
      user_interface: v.optional(v.string())
    })),
  },
  handler: async (ctx, { userId, amount, currency, metadata }) => {
    return await ctx.db.insert("payments", { 
      userId, 
      amount, 
      currency, 
      status: "pending", 
      createdAt: Date.now(),
      metadata
    });
  },
});

// Mark a payment as pending with Stripe session ID
export const markPending = internalMutation({
  args: {
    paymentId: v.id("payments"),
    stripeId: v.string(),
    stripeSessionId: v.string(),
  },
  handler: async (ctx, { paymentId, stripeId, stripeSessionId }) => {
    await ctx.db.patch(paymentId, { 
      stripeId, 
      stripeSessionId,
      updatedAt: Date.now()
    });
  },
});

// Mark a payment as completed
export const fulfill = internalMutation({
  args: { stripeId: v.string() },
  handler: async (ctx, { stripeId }) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_stripeId", (q) => q.eq("stripeId", stripeId))
      .unique();
    
    if (!payment) {
      throw new Error(`Payment with Stripe ID ${stripeId} not found`);
    }
    
    // Mark the payment as completed
    await ctx.db.patch(payment._id, { 
      status: "completed",
      updatedAt: Date.now()
    });

    // If you had a subscription or user status to update, you would do it here
    if (payment.userId) {
      // Update user subscription status
      // This is where you'd mark the user as a paying customer
      // Example: await ctx.db.patch(userId, { isPremium: true, subscriptionEndDate: ... })
    }
    
    return payment._id;
  },
});

// Get payment by ID
export const getById = query({
  args: { paymentId: v.id("payments") },
  handler: async (ctx, { paymentId }) => {
    return await ctx.db.get(paymentId);
  },
});

// Get user payments
export const getUserPayments = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("payments")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

// Add this new function to store mock payment data
export const storeMockPayment = mutation({
  args: {
    userId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    paymentId: v.string(),
    planType: v.optional(v.string()),
    email: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { userId, amount, currency, paymentId, planType, email } = args;
    
    // Store the mock payment in the database
    const payment = await ctx.db.insert("payments", {
      userId,
      amount,
      currency,
      status: "completed", // Mock payments are always completed
      stripeId: `mock_${paymentId}`,
      stripeSessionId: `mock_session_${paymentId}`,
      metadata: {
        planType: planType || "pro",
        // Store mock status in a field that exists in the schema
        duration: "mock_payment"
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    // For now, just log this payment but don't attempt to update the user
    console.log(`Recorded payment for user ${userId || "anonymous"}: ${amount} ${currency}`);
    
    return payment;
  }
}); 
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,
  
  users: defineTable({
    tokenIdentifier: v.optional(v.string()),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
  })
  .index("by_token", ["tokenIdentifier"])
  .index("email", ["email"]),
  
  payments: defineTable({
    userId: v.optional(v.string()),
    amount: v.number(),
    currency: v.string(),
    status: v.string(), // "pending", "completed", "failed"
    stripeId: v.optional(v.string()),
    stripeSessionId: v.optional(v.string()),
    metadata: v.optional(v.object({
      planType: v.optional(v.string()),
      duration: v.optional(v.string()),
      features: v.optional(v.array(v.string())),
      date: v.optional(v.string()),
      plan: v.optional(v.string()),
      priceId: v.optional(v.string()),
      user_interface: v.optional(v.string())
    })),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  })
  .index("by_user", ["userId"])
  .index("by_status", ["status"])
  .index("by_stripeId", ["stripeId"]),
  
  logs: defineTable({
    userId: v.string(),
    date: v.string(),
    content: v.string(),
    score: v.number(),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.object({
      mood: v.optional(v.string()),
      energy: v.optional(v.number()),
    })),
  })
  .index("by_user_date", ["userId", "date"])
  .index("by_score", ["score"]),
}); 
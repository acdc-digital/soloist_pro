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
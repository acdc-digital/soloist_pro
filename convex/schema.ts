import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
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
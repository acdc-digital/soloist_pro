import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser } from "./auth";

export const create = mutation({
  args: {
    date: v.string(),
    content: v.string(),
    score: v.number(),
    tags: v.optional(v.array(v.string())),
    metadata: v.optional(v.object({
      mood: v.optional(v.string()),
      energy: v.optional(v.number()),
    })),
  },
  async handler(ctx, args) {
    const { user } = await requireUser(ctx);
    
    return await ctx.db.insert("logs", {
      userId: user._id,
      date: args.date,
      content: args.content,
      score: args.score,
      tags: args.tags,
      metadata: args.metadata,
    });
  },
});

export const getByDate = query({
  args: {
    date: v.string(),
  },
  async handler(ctx, args) {
    const { user } = await requireUser(ctx);
    
    return await ctx.db
      .query("logs")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", user._id).eq("date", args.date)
      )
      .first();
  },
});

export const getByUserId = query({
  args: {},
  async handler(ctx) {
    const { user } = await requireUser(ctx);
    
    return await ctx.db
      .query("logs")
      .withIndex("by_user_date", (q) => 
        q.eq("userId", user._id)
      )
      .collect();
  },
}); 
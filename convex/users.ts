import { query } from "./_generated/server";
import { requireUser } from "./auth";
import { v } from "convex/values";

// Fetches the current authenticated user's profile from the users table.
// This relies on the user profile being created by the `store` function
// exported from the new `convex/auth.ts` when a user signs in.
export const getMe = query({
  args: {},
  async handler(ctx) {
    // The `isAuthenticated` and `user` (identity) should come from `convex/auth.ts` mechanism.
    // We need a way to get the user record from our `users` table using the identity.
    // For now, let's assume `requireUser` from the new auth setup gives us what we need,
    // or we might need to query the users table directly using identity.subject or similar.
    
    // This part needs to be re-evaluated based on what `convexAuth` provides.
    // If `convex/auth.ts` `store` function populates `users` table, 
    // then we need a way to get the user based on the authenticated identity.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      console.log("No user identity found in users.get");
      return null;
    }

    // Attempt to get the user from the users table using the tokenIdentifier (subject from JWT)
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) {
      console.log(`User profile not found in users table for subject: ${identity.subject}. The store function in auth.ts should have created this.`);
      // It's possible the user is authenticated but their profile hasn't been written to `users` table yet
      // or the `store` function in `auth.ts` needs to be explicitly called by client after login.
      // The instructions say: "See the general OAuth instructions for how to add a sign-in button in your application."
      // This usually involves a client-side call to a mutation that stores the user after successful OAuth.
      // The `store` exported from `convex/auth.ts` might be that mutation.
      return null; 
    }
    return user;
  },
});

// Potentially, other user-specific queries can remain or be added here.
// Functions like `createWithEmail` and `store` (the old one) are removed 
// as user creation/linking should be handled by the new `convex/auth.ts` `store` function.
// `getByTokenIdentifier` might also be superseded by auth mechanisms.

// Potentially useful in the future: Get user by ID for admin or profile pages
export const getById = query({
  args: { userId: v.id("users") },
  async handler(ctx, args) {
    return await ctx.db.get(args.userId);
  },
}); 
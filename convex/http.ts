import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { internal } from "./_generated/api";

// Create the root router for HTTP actions.
const http = httpRouter();

// Set up the auth routes
auth.addHttpRoutes(http);

// Stripe webhook endpoint
http.route({
  path: "/api/webhooks/stripe",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Extract Stripe signature from headers
    const signature = request.headers.get("stripe-signature");
    
    if (!signature) {
      return new Response("Missing stripe-signature header", { status: 400 });
    }
    
    // Pass to our fulfill action to process the webhook
    const result = await ctx.runAction(internal.stripe.fulfill, {
      signature,
      payload: await request.text(),
    });
    
    if (result.success) {
      // Return 200 OK to Stripe to acknowledge receipt
      return new Response(null, { status: 200 });
    } else {
      // Let Stripe know something went wrong so it can retry
      return new Response("Webhook Error: " + (result.error || "Unknown error"), {
        status: 400,
      });
    }
  }),
});

// If you have other HTTP routes, define them here before the export.

// Convex expects the router to be the default export.
export default http; 
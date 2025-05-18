// Script to set up Stripe environment variables in Convex
// Run this script with: npx convex run setupStripeEnv.js --help

/**
 * This is a one-time setup script for Stripe integration.
 * 
 * Required environment variables:
 * - STRIPE_KEY: Your Stripe secret key
 * - STRIPE_WEBHOOKS_SECRET: The signing secret for your Stripe webhook
 * - HOSTING_URL: Your app's URL (e.g., https://your-app.vercel.app)
 * 
 * To get these values:
 * 1. Create a Stripe account at https://stripe.com
 * 2. Get your API keys from the Stripe Dashboard
 * 3. For webhook secret, create a webhook endpoint in the Stripe Dashboard
 *    pointing to: https://YOUR_CONVEX_DEPLOYMENT.convex.site/stripe/webhook
 */

async function setupStripeEnv(args, context) {
  // Parse arguments
  if (args.help) {
    console.log(`
Usage: npx convex run setupStripeEnv.js --stripeKey=sk_test_... --webhookSecret=whsec_... --hostingUrl=https://...

Required arguments:
  --stripeKey       Your Stripe secret key (starts with sk_)
  --webhookSecret   Your Stripe webhook signing secret (starts with whsec_)
  --hostingUrl      Your app's URL (e.g., https://your-app.vercel.app)

Optional arguments:
  --help            Show this help message
    `);
    return;
  }
  
  if (!args.stripeKey || !args.webhookSecret || !args.hostingUrl) {
    throw new Error("Missing required arguments. Run with --help for usage instructions.");
  }
  
  // Set environment variables in Convex
  await context.env.setAll({
    STRIPE_KEY: args.stripeKey,
    STRIPE_WEBHOOKS_SECRET: args.webhookSecret,
    HOSTING_URL: args.hostingUrl,
  });
  
  console.log("Stripe environment variables set successfully!");
  console.log("Your Stripe webhook endpoint is:");
  console.log(`${context.deploymentUrl}/stripe/webhook`);
  console.log("\nMake sure to set this URL in your Stripe Dashboard webhook settings.");
}

export default setupStripeEnv; 
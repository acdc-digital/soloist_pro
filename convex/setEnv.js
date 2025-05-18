"use node";

// Simple script to set environment variables for Stripe
// Just run with: node setEnv.js

const { exec } = require('child_process');

// Replace these with your actual values
const stripeKey = 'sk_test_placeholder';  // Replace with your Stripe secret key
const webhookSecret = 'whsec_placeholder'; // Replace with your webhook signing secret
const hostingUrl = 'http://localhost:3002'; // Replace with your app's URL

// Set the environment variables
const commands = [
  `npx convex env set STRIPE_KEY "${stripeKey}"`,
  `npx convex env set STRIPE_WEBHOOKS_SECRET "${webhookSecret}"`,
  `npx convex env set HOSTING_URL "${hostingUrl}"`
];

async function runCommands() {
  for (const cmd of commands) {
    console.log(`Running: ${cmd}`);
    try {
      await new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`Stderr: ${stderr}`);
          }
          console.log(`Output: ${stdout}`);
          resolve();
        });
      });
    } catch (error) {
      console.error('Command failed:', error);
      process.exit(1);
    }
  }
  console.log('Environment variables set successfully!');
}

runCommands(); 
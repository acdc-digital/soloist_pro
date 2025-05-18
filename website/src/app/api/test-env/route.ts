import { NextResponse } from 'next/server';

export async function GET() {
  // List environment variables (non-sensitive ones only)
  const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    // Don't include actual secret keys here, just whether they exist
    HAS_STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    HAS_STRIPE_PUBLISHABLE_KEY: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    HAS_STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    // Server info
    SERVER_TIMESTAMP: new Date().toISOString(),
    // Runtime information
    RUNTIME: {
      versionedPublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) + '...',
      hostUrl: process.env.NEXT_PUBLIC_APP_URL || 'unknown',
    }
  };

  return NextResponse.json(envVars);
} 
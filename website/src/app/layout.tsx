// WEBSITE LAYOUT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme/theme-provider";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Soloist - Mood Tracking App",
  description: "Track your mood and get AI-powered insights with Soloist",
  // Add CSP to metadata for better browser compatibility
  other: {
    "Content-Security-Policy": `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
      frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com;
      img-src 'self' data: https://*.stripe.com;
      connect-src 'self' https://api.stripe.com;
      style-src 'self' 'unsafe-inline' https://checkout.stripe.com;
      frame-ancestors 'self' http://localhost:* https://localhost:*;
    `.replace(/\s+/g, ' ').trim()
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Add preconnect for Stripe resources */}
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="preconnect" href="https://api.stripe.com" />
        <link rel="preconnect" href="https://checkout.stripe.com" />
        
        {/* Add script to catch and fix Stripe locale errors */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle Stripe locale module loading errors
              window.addEventListener('error', function(event) {
                if (event.message && event.message.includes('Cannot find module \\\\'./en\\\\\'')) {
                  console.warn('Stripe locale error intercepted');
                  window.Stripe = window.Stripe || {};
                  window.Stripe._locale = window.Stripe._locale || {};
                  window.Stripe._locale.en = window.Stripe._locale.en || {};
                  event.preventDefault();
                }
              }, true);
            `
          }}
        />
      </head>
      <body className={inter.className}>
      <ConvexClientProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </ThemeProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
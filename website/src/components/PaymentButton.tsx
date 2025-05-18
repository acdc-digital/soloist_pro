"use client";

import { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';

interface PaymentButtonProps {
  planType: string;
  priceId: string;
  buttonText?: string;
  className?: string;
}

export default function PaymentButton({
  planType,
  priceId,
  buttonText = "Subscribe",
  className = ""
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth() || {};
  const createCheckout = useAction(api.stripe.createCheckoutSession);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Call the Stripe checkout action
      const checkoutUrl = await createCheckout({
        planType,
        priceId,
        userId: user?.id,
      });
      
      // Redirect to Stripe checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("There was an error processing your payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 ${className}`}
    >
      {isLoading ? "Processing..." : buttonText}
    </button>
  );
} 
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  // Get payment details from the paymentId query parameter
  useEffect(() => {
    const id = searchParams.get("paymentId");
    if (id) {
      setPaymentId(id);
    } else {
      // Redirect to home if no payment ID is found
      router.push("/");
    }
  }, [searchParams, router]);
  
  // Fetch payment details
  const payment = useQuery(api.payments.getById, 
    paymentId ? { paymentId: paymentId as any } : "skip"
  );
  
  if (!paymentId) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-300" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-4 dark:text-white">Payment Successful!</h1>
        
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Thank you for your payment. Your transaction has been completed successfully.
        </p>
        
        {payment && (
          <div className="bg-gray-50 dark:bg-zinc-700 p-4 rounded-lg mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 dark:text-gray-400">Amount:</span>
              <span className="font-medium dark:text-white">${payment.amount/100} {payment.currency.toUpperCase()}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500 dark:text-gray-400">Status:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{payment.status}</span>
            </div>
            {payment.metadata?.planType && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Plan:</span>
                <span className="font-medium dark:text-white">{payment.metadata.planType}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="space-y-3">
          <Link href="/dashboard" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium">
            Go to Dashboard
          </Link>
          <Link href="/" className="block w-full bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-md font-medium">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
} 
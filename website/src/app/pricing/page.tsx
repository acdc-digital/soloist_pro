'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Pricing from '@/components/Pricing';

export default function PricingPage() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled') === 'true';
  const success = searchParams.get('success') === 'true';
  const [showCancelMessage, setShowCancelMessage] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Show notifications for payment results
  useEffect(() => {
    if (canceled) {
      setShowCancelMessage(true);
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowCancelMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    if (success) {
      setShowSuccessMessage(true);
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [canceled, success]);
  
  return (
    <>
      {showCancelMessage && (
        <div className="fixed top-4 right-4 z-50 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-start">
            <div className="ml-3">
              <p className="font-medium">Payment Canceled</p>
              <p className="text-sm">Your payment was canceled. No charges were made.</p>
            </div>
            <button 
              className="ml-auto -mx-1.5 -my-1.5 bg-amber-50 text-amber-500 rounded-lg p-1.5 hover:bg-amber-100"
              onClick={() => setShowCancelMessage(false)}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <div className="flex items-start">
            <div className="ml-3">
              <p className="font-medium">Payment Successful!</p>
              <p className="text-sm">Thank you for your purchase. Your account has been upgraded to Pro.</p>
            </div>
            <button 
              className="ml-auto -mx-1.5 -my-1.5 bg-emerald-50 text-emerald-500 rounded-lg p-1.5 hover:bg-emerald-100"
              onClick={() => setShowSuccessMessage(false)}
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <Pricing />
    </>
  );
} 
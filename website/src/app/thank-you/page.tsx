'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const success = searchParams.get('success') === 'true';
  const paymentIntentId = searchParams.get('payment_intent_id');
  const sessionId = searchParams.get('session_id');
  const canceled = searchParams.get('canceled') === 'true';
  const paymentId = searchParams.get('payment_id'); // From Pricing.tsx redirect
  
  useEffect(() => {
    // If the payment was explicitly canceled, no need to verify
    if (canceled) {
      setLoading(false);
      setError('Payment was canceled.');
      return;
    }

    const verifyPayment = async () => {
      try {
        // We have either a payment_intent_id, session_id, or payment_id
        if (paymentIntentId) {
          const res = await fetch(`/api/stripe/verify-payment?payment_intent_id=${paymentIntentId}`);
          if (!res.ok) {
            throw new Error('Failed to verify payment');
          }
          const data = await res.json();
          setPaymentInfo(data);
        } else if (sessionId) {
          const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
          if (!res.ok) {
            throw new Error('Failed to verify session');
          }
          const data = await res.json();
          setPaymentInfo(data);
        } else if (paymentId) {
          // This is from the direct redirect in Pricing.tsx
          const res = await fetch(`/api/stripe/verify-payment?payment_intent_id=${paymentId}`);
          if (!res.ok) {
            throw new Error('Failed to verify payment');
          }
          const data = await res.json();
          setPaymentInfo(data);
        } else {
          // No payment identifiers, but still show success if query param indicates success
          if (!success) {
            throw new Error('No payment identifiers found');
          }
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    // Only verify if we have an ID to verify or success=true
    if (paymentIntentId || sessionId || paymentId || success) {
      verifyPayment();
    } else {
      setLoading(false);
      // If no parameters at all, show a generic success message
      // This can happen if user is redirected here without params
    }
  }, [paymentIntentId, sessionId, paymentId, success, canceled]);
  
  // Show appropriate message based on payment status
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      );
    }
    
    if (canceled) {
      return (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold">Payment Canceled</h1>
          
          <p className="text-lg text-gray-600">
            Your payment was canceled. No charges were made.
          </p>
          
          <div className="pt-6 flex flex-col gap-4">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/pricing">
                Return to Pricing
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold">Payment Issue</h1>
          
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            <p>There was an issue with your payment: {error}</p>
          </div>
          
          <p className="text-gray-600">
            If you believe this is an error, please contact our support team.
          </p>
          
          <div className="pt-6 flex flex-col gap-4">
            <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
              <Link href="/pricing">
                Try Again
              </Link>
            </Button>
            
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      );
    }
    
    // Default success view (with or without payment details)
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold">Thank You for Your Purchase!</h1>
        
        <p className="text-lg text-gray-600">
          Your payment was successful and your account has been upgraded to Pro.
        </p>
        
        {paymentInfo && (
          <div className="bg-gray-50 rounded-lg p-4 mt-6 text-left">
            <h3 className="font-medium mb-2">Payment Details</h3>
            <div className="space-y-1 text-sm">
              {paymentInfo.id && (
                <p><span className="font-medium">Transaction ID:</span> {paymentInfo.id}</p>
              )}
              {paymentInfo.amount && (
                <p><span className="font-medium">Amount:</span> ${(paymentInfo.amount / 100).toFixed(2)}</p>
              )}
              {paymentInfo.status && (
                <p><span className="font-medium">Status:</span> {paymentInfo.status}</p>
              )}
            </div>
          </div>
        )}
        
        <div className="pt-6">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {renderContent()}
      </div>
    </div>
  );
} 
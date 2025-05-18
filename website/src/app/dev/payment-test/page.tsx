'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export default function PaymentTestPage() {
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Create a test payment intent
  const createTestPaymentIntent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
          customerEmail: 'test@example.com',
          metadata: {
            test: 'true',
            test_env: process.env.NODE_ENV
          }
        })
      });
      
      if (!res.ok) {
        throw new Error(`Failed to create payment intent: ${res.status}`);
      }
      
      const data = await res.json();
      setPaymentIntentId(data.id);
      setResult(data);
    } catch (err) {
      console.error('Error creating test payment intent:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  // Create a test checkout session
  const createTestCheckoutSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID,
          successUrl: `${window.location.origin}/thank-you?success=true&test=true`,
          cancelUrl: `${window.location.origin}/dev/payment-test?canceled=true`,
          customerEmail: 'test@example.com',
          metadata: {
            test: 'true',
            test_env: process.env.NODE_ENV
          }
        })
      });
      
      if (!res.ok) {
        throw new Error(`Failed to create checkout session: ${res.status}`);
      }
      
      const data = await res.json();
      setSessionId(data.sessionId);
      setResult(data);
    } catch (err) {
      console.error('Error creating test checkout session:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };
  
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto text-center">
          <AlertTriangle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Development Only</h1>
          <p className="mb-6">This page is only available in development mode.</p>
          <Link href="/" passHref>
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Stripe Payment Testing</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payment Intent Testing</h2>
            <p className="mb-4 text-gray-600 text-sm">
              Creates a payment intent for testing the checkout flow without redirecting.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={createTestPaymentIntent}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create Test Payment Intent'}
              </Button>
              
              {paymentIntentId && (
                <div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="p-2 bg-gray-50 rounded text-sm font-mono overflow-x-auto">
                      {paymentIntentId}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/api/stripe/dev-payment?payment_intent_id=${paymentIntentId}&action=succeed`} passHref>
                        <Button variant="outline" size="sm" className="w-full">
                          Simulate Success
                        </Button>
                      </Link>
                      
                      <Link href={`/api/stripe/dev-payment?payment_intent_id=${paymentIntentId}&action=fail`} passHref>
                        <Button variant="outline" size="sm" className="w-full">
                          Simulate Failure
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Checkout Session Testing</h2>
            <p className="mb-4 text-gray-600 text-sm">
              Creates a checkout session for testing the redirect flow.
            </p>
            
            <div className="space-y-4">
              <Button 
                onClick={createTestCheckoutSession}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating...' : 'Create Test Checkout Session'}
              </Button>
              
              {sessionId && (
                <div>
                  <div className="flex flex-col gap-2 mt-4">
                    <div className="p-2 bg-gray-50 rounded text-sm font-mono overflow-x-auto">
                      {sessionId}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Link href={`/api/stripe/dev-payment?session_id=${sessionId}&action=succeed`} passHref>
                        <Button variant="outline" size="sm" className="w-full">
                          Simulate Success
                        </Button>
                      </Link>
                      
                      <Link href={`/api/stripe/dev-payment?session_id=${sessionId}&action=fail`} passHref>
                        <Button variant="outline" size="sm" className="w-full">
                          Simulate Failure
                        </Button>
                      </Link>
                    </div>
                    
                    {result?.sessionUrl && (
                      <Link href={result.sessionUrl} passHref target="_blank" rel="noopener noreferrer">
                        <Button className="w-full mt-2">
                          Open Real Checkout
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {result && (
          <div className="mt-8 border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4">API Response</h3>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 
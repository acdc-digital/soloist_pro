'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

// Define a simple input component since the UI library may not have one
const Input = ({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; 
  placeholder?: string 
}) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
  />
);

/**
 * This is a development-only tool to handle the "Cannot find module './en'" error
 * by bypassing the Stripe checkout flow entirely for testing
 */
export default function StripeCheckoutFix() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  
  // Handle direct success simulation
  const simulateSuccess = () => {
    // Use a mock session/payment ID if none provided
    const mockId = 'dev_mock_' + Math.random().toString(36).substring(2, 10);
    const sid = sessionId || mockId;
    const pid = paymentIntentId || mockId;
    
    // Generate a direct link to the thank you page
    router.push(`/thank-you?success=true&session_id=${sid}&payment_intent_id=${pid}&dev_test=true`);
  };
  
  // Handle direct failure simulation
  const simulateFailure = () => {
    router.push('/thank-you?error=true&dev_test=true');
  };
  
  // Handle direct cancel simulation
  const simulateCancel = () => {
    router.push('/thank-you?canceled=true&dev_test=true');
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
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Stripe Checkout Fix</h1>
          <p className="text-gray-600">
            This development tool helps bypass the Stripe checkout flow when experiencing the<br/> 
            <code className="bg-gray-100 px-2 py-1 rounded text-red-500 font-mono text-sm">Cannot find module './en'</code> error.
          </p>
        </div>
        
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-4 items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="text-lg font-semibold text-amber-800 mb-1">Development Mode Only</h2>
              <p className="text-amber-700 text-sm">
                This is a workaround for development environments only. In production, you should use the proper Stripe checkout flow.
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Test Payment Flow</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Session ID (optional)</label>
                <Input 
                  value={sessionId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSessionId(e.target.value)}
                  placeholder="e.g., cs_test_..."
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to generate a mock ID</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Payment Intent ID (optional)</label>
                <Input 
                  value={paymentIntentId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPaymentIntentId(e.target.value)}
                  placeholder="e.g., pi_..."
                />
                <p className="text-xs text-gray-500 mt-1">Leave blank to generate a mock ID</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button 
                onClick={simulateSuccess}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Simulate Success
              </Button>
              
              <Button 
                onClick={simulateFailure}
                className="bg-red-600 hover:bg-red-700"
              >
                Simulate Failure
              </Button>
              
              <Button 
                onClick={simulateCancel}
                variant="outline"
              >
                Simulate Cancel
              </Button>
            </div>
          </div>
          
          <div className="border rounded-lg p-6 bg-white">
            <h2 className="text-xl font-semibold mb-4">Other Test Pages</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/dev/payment-test" passHref>
                <Button variant="outline" className="w-full">
                  Payment Test Page
                </Button>
              </Link>
              
              <Link href="/thank-you?success=true&dev_test=true" passHref>
                <Button variant="outline" className="w-full">
                  Thank You Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
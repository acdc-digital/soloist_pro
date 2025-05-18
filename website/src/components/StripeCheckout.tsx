// STRIPE CHECKOUT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/StripeCheckout.tsx

'use client'

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  AddressElement
} from '@stripe/react-stripe-js';

interface StripeCheckoutProps {
  priceId?: string;
  email?: string;
  customerData?: {
    [key: string]: string;
  };
  onSuccess?: (sessionId: string) => void;
  onCancel?: () => void;
  successUrl?: string;
  cancelUrl?: string;
}

// Create portal root for modal rendering
let portalRoot: HTMLElement | null = null;
if (typeof document !== 'undefined') {
  portalRoot = document.getElementById('stripe-portal-root');
  if (!portalRoot) {
    portalRoot = document.createElement('div');
    portalRoot.id = 'stripe-portal-root';
    document.body.appendChild(portalRoot);
  }
}

// Load Stripe outside of component render to avoid recreating it on every render
// Force English locale to avoid module loading issues
const stripePromise = typeof window !== 'undefined'
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '', {
      locale: 'en'
    })
  : null;

// Inline checkout form component using Stripe Elements
function CheckoutForm({ clientSecret, paymentIntentId, onSuccess, onCancel }: { 
  clientSecret: string;
  paymentIntentId: string;
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    // Use confirmPayment to complete the payment
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/',
      },
      redirect: 'if_required', // Try to avoid redirects if possible
    });

    if (error) {
      console.error('Payment error:', error);
      setErrorMessage(error.message || 'An error occurred with your payment');
      setIsProcessing(false);
      return;
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment completed successfully without redirect
      console.log('Payment succeeded:', paymentIntent.id);
      setPaymentSucceeded(true);
      setIsProcessing(false);
      // Don't call onSuccess yet - let the user see the thank you message
    } else if (paymentIntent) {
      // Payment requires additional actions, but we already handled it
      console.log('Payment status:', paymentIntent.status);
      setPaymentSucceeded(true);
      setIsProcessing(false);
    }
  };

  // Show the thank you view after successful payment
  if (paymentSucceeded) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800">Thank You for Your Purchase!</h3>
        
        <p className="text-gray-600">
          Your payment was successful and your account has been upgraded to Pro.
        </p>
        
        <div className="pt-4">
          <button 
            type="button"
            onClick={() => {
              if (onSuccess && paymentIntentId) {
                onSuccess(paymentIntentId);
              } else {
                onCancel?.();
              }
            }}
            className="w-full py-3 px-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      
      {errorMessage && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
          {errorMessage}
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        <button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="w-full py-3 px-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium disabled:opacity-70"
        >
          {isProcessing ? "Processing..." : "Pay Securely"}
        </button>
        
        <button 
          type="button"
          onClick={onCancel}
          className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// Modal component with Stripe Elements integration
function StripeModal({ 
  clientSecret, 
  paymentIntentId, 
  onSuccess, 
  onCancel 
}: { 
  clientSecret: string; 
  paymentIntentId: string;
  onSuccess?: (id: string) => void;
  onCancel?: () => void;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Detect if we're using a mock client secret
  const isMockSecret = clientSecret?.includes('mock_client_secret');

  // For mock client secret, simulate a successful payment
  useEffect(() => {
    if (isMockSecret && isMounted) {
      setIsProcessing(true);
      const timer = setTimeout(() => {
        setIsProcessing(false);
        setPaymentSucceeded(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isMockSecret, isMounted]);

  // Ensure DOM is available
  useEffect(() => {
    setIsMounted(true);
    // Add class to body to disable scrolling
    document.body.classList.add('stripe-checkout-open');
    
    return () => {
      // Remove class from body when component unmounts
      document.body.classList.remove('stripe-checkout-open');
    };
  }, []);

  // Close modal when clicking outside
  const handleOutsideClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel?.();
    }
  };

  if (!isMounted) {
    return null;
  }

  // Show the thank you view after successful payment
  if (paymentSucceeded) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={handleOutsideClick}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 relative">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800">Thank You for Your Purchase!</h3>
            
            <p className="text-gray-600">
              Your payment was successful and your account has been upgraded to Pro.
            </p>
            
            <div className="pt-4">
              <button 
                type="button"
                onClick={() => {
                  if (onSuccess && paymentIntentId) {
                    onSuccess(paymentIntentId);
                  } else {
                    onCancel?.();
                  }
                }}
                className="w-full py-3 px-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
        onClick={handleOutsideClick}
        style={{ backdropFilter: 'blur(4px)' }}
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 relative">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-gray-800">Payment Error</h3>
            
            <p className="text-gray-600">
              We couldn't initialize the payment process. Please try again later.
            </p>
            
            <div className="pt-4">
              <button 
                type="button"
                onClick={onCancel}
                className="w-full py-3 px-4 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={handleOutsideClick}
      style={{ backdropFilter: 'blur(4px)' }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md m-4 p-6 relative">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          onClick={onCancel}
          aria-label="Close payment form"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <rect width="20" height="14" x="2" y="5" rx="2"></rect>
              <line x1="2" x2="22" y1="10" y2="10"></line>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800">Complete Your Purchase</h2>
          <p className="text-gray-600 mt-2">Enter your payment details below</p>
        </div>
        
        {isMockSecret ? (
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-600">
              <div className="flex items-center mb-2">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-medium">Test Mode</span>
              </div>
              <p>This is a mock checkout environment for testing purposes.</p>
              <div className="mt-2 animate-pulse bg-gray-200 h-40 rounded-md flex items-center justify-center text-gray-400">
                Simulated Payment Form
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                type="button" 
                disabled={isProcessing}
                className="w-full py-3 px-4 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors font-medium disabled:opacity-70"
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setPaymentSucceeded(true);
                  }, 1500);
                }}
              >
                {isProcessing ? "Processing..." : "Pay Securely"}
              </button>
              
              <button 
                type="button"
                onClick={onCancel}
                className="w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              clientSecret={clientSecret} 
              paymentIntentId={paymentIntentId}
              onSuccess={onSuccess}
              onCancel={onCancel}
            />
          </Elements>
        )}
      </div>
    </div>
  );
}

/**
 * StripeCheckout utilities for handling Stripe Checkout integration
 */
const StripeCheckout = {
  /**
   * Opens a modal checkout directly on the page using Stripe Elements
   */
  openModalCheckout: async ({
    priceId,
    email,
    customerData = {},
    onSuccess,
    onCancel
  }: StripeCheckoutProps) => {
    try {
      // We need priceId for this approach
      if (!priceId) {
        throw new Error('priceId is required for checkout');
      }
      
      console.log("Creating payment intent with:", { priceId, email, customerData });
      
      // Create a payment intent on the server
      const response = await fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          customerEmail: email || '',
          metadata: customerData
        }),
      });
      
      // Handle non-200 status codes
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Payment intent error:", errorData);
        
        // If there's an email validation error, retry without an email
        if (errorData.isEmailError && email) {
          console.log("Retrying payment intent creation without email");
          return await StripeCheckout.openModalCheckout({
            priceId,
            email: '',
            customerData,
            onSuccess,
            onCancel
          });
        }
        
        throw new Error(errorData.error || 'Failed to create payment intent');
      }
      
      // Parse the response data
      const { clientSecret, id: paymentIntentId } = await response.json();
      console.log("Received payment intent:", { 
        paymentIntentId,
        isMock: clientSecret?.includes('mock_client_secret') 
      });
      
      if (!clientSecret) {
        throw new Error('No client secret returned from server');
      }
      
      // Create modal container
      const modalContainer = document.createElement('div');
      modalContainer.id = 'stripe-elements-container';
      document.body.appendChild(modalContainer);
      
      // Render the React component
      const root = document.createElement('div');
      root.id = 'stripe-modal-root';
      modalContainer.appendChild(root);
      
      // Use ReactDOM.render to render the modal
      if (typeof window !== 'undefined') {
        const ReactDOM = await import('react-dom/client');
        const reactRoot = ReactDOM.createRoot(root);
        
        // Define cleanup function
        const cleanupModal = () => {
          // Unmount React component
          reactRoot.unmount();
          
          // Remove the container from the DOM
          if (document.body.contains(modalContainer)) {
            document.body.removeChild(modalContainer);
          }
          
          // Remove class from body to enable scrolling
          document.body.classList.remove('stripe-checkout-open');
        };
        
        // Handle success callback
        const handleSuccess = (paymentId: string) => {
          cleanupModal();
          onSuccess?.(paymentId);
        };
        
        // Handle cancel callback
        const handleCancel = () => {
          cleanupModal();
          onCancel?.();
        };
        
        // Render the component
        reactRoot.render(
          <StripeModal 
            clientSecret={clientSecret} 
            paymentIntentId={paymentIntentId}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        );
        
        // Return cleanup function
        return cleanupModal;
      }
      
      // Fallback for SSR
      return () => {};
    } catch (error) {
      console.error('Error creating payment intent:', error);
      document.body.classList.remove('stripe-checkout-open');
      throw error;
    }
  },

  /**
   * Redirect method for direct checkout - redirects to Stripe Checkout page
   */
  redirectToCheckout: async ({
    priceId,
    email,
    customerData = {},
    successUrl,
    cancelUrl
  }: StripeCheckoutProps) => {
    if (!priceId) {
      throw new Error('priceId is required for redirectToCheckout');
    }
    
    try {
      console.log("Creating checkout session with:", { priceId, email, customerData });
      
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          successUrl: successUrl || `${window.location.origin}/thank-you?success=true`,
          cancelUrl: cancelUrl || window.location.href,
          customerEmail: email,
          metadata: customerData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Checkout session error:", errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionUrl } = await response.json();
      console.log("Redirecting to checkout:", sessionUrl);

      if (sessionUrl?.includes('mock-checkout-redirect')) {
        console.log("This is a mock checkout URL. Would normally redirect to:", sessionUrl);
        // For testing, simulate a successful checkout
        setTimeout(() => {
          const successPath = successUrl || `${window.location.origin}/thank-you?success=true`;
          window.location.href = successPath;
        }, 1500);
        return;
      }

      // Redirect to checkout
      window.location.href = sessionUrl;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }
};

export default StripeCheckout;
// PRICING COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/Pricing.tsx

'use client'

import React, { useState, useEffect } from "react";
import { Check, AlertCircle } from "lucide-react";
import StripeCheckout from './StripeCheckout';

// Define the electron global for TypeScript
declare global {
  interface Window {
    electron?: {
      send: (channel: string, data: any) => void;
      receive: (channel: string, func: (...args: any[]) => void) => void;
      openExternal: (url: string) => void;
    };
  }
}

// Initial Stripe configuration with placeholder values
const INITIAL_STRIPE_CONFIG = {
  publishableKey: '',
  prices: {
    pro: {
      month: '',
      year: ''
    }
  }
};

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText?: string;
  isPopular?: boolean;
  buttonVariant?: "default" | "primary";
  onButtonClick?: () => void;
  customButton?: React.ReactNode;
}

// Card component for pricing
const PricingCard: React.FC<PricingCardProps> = ({ 
  title, 
  description, 
  price, 
  period, 
  features, 
  buttonText, 
  isPopular = false,
  buttonVariant = "default",
  onButtonClick,
  customButton
}) => {
  return (
    <div className={`border rounded-xl overflow-hidden h-full relative ${isPopular ? 'border-emerald-600 border-2' : 'border-gray-300 dark:border-zinc-700 border-2'} dark:bg-zinc-900`}>
      {isPopular && (
        <div className="absolute top-0 left-0 right-0 mx-auto w-fit px-4 py-1 bg-emerald-600 text-white text-sm font-medium rounded-b-lg">
          Most Popular
        </div>
      )}
      
      <div className="p-8 flex flex-col h-full">
        <div className="mb-8">
          <h3 className="text-3xl font-bold mb-2 dark:text-white">{title}</h3>
          <p className="text-gray-600 dark:text-gray-300">{description}</p>
        </div>
        
        <div className="mb-8">
          <div className="flex items-baseline">
            <span className="text-6xl font-bold dark:text-white">{price}</span>
            <span className="ml-2 text-xl text-gray-600 dark:text-gray-300">/{period}</span>
          </div>
        </div>
        
        <div className="flex-grow">
          <ul className="space-y-4">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="mr-3 h-5 w-5 text-black dark:text-white mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-8">
          {customButton ? (
            customButton
          ) : (
            <button 
              onClick={onButtonClick}
              className={`w-full py-3 font-medium rounded-full transition-colors shadow-md ${
                buttonVariant === "primary" 
                  ? "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg" 
                  : "border-2 border-gray-400 dark:border-zinc-600 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:shadow-lg text-gray-700 dark:text-gray-200"
              }`}
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  toggleOpen: () => void;
}

// FAQ Accordion Item
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="border-b border-gray-200 dark:border-zinc-700 py-5">
      <button 
        className="flex justify-between items-center w-full text-left font-medium dark:text-white"
        onClick={toggleOpen}
      >
        {question}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      {isOpen && (
        <div className="mt-3 text-gray-600 dark:text-gray-300">
          {answer}
        </div>
      )}
    </div>
  );
};

interface PricingProps {
  canceled?: boolean;
}

export default function Pricing({ canceled = false }: PricingProps) {
  const [activeTab, setActiveTab] = useState("monthly");
  const [openFAQs, setOpenFAQs] = useState({
    "item-1": false,
    "item-2": false,
    "item-3": false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stripeConfig, setStripeConfig] = useState(INITIAL_STRIPE_CONFIG);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const prices = {
    monthly: "$9",
    yearly: "$89"
  };

  // Handle canceled payment notification
  useEffect(() => {
    if (canceled) {
      setErrorMessage("Your payment was canceled. No charges were made.");
      
      // Clear the error after 5 seconds
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [canceled]);

  // Load environment variables when component mounts
  useEffect(() => {
    // Next.js automatically loads .env.local variables with the NEXT_PUBLIC_ prefix
    setStripeConfig({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
      prices: {
        pro: {
          month: process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || '',
          year: process.env.NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID || ''
        }
      }
    });
  }, []);

  type FAQItemKey = "item-1" | "item-2" | "item-3";

  const toggleFAQ = (item: FAQItemKey) => {
    setOpenFAQs(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const freePlanFeatures = [
    "Basic mood tracking",
    "7-day forecasting",
    "Daily journal entries",
    "Standard mood visualization"
  ];

  const proPlanFeatures = [
    "Everything in Free",
    "30-day forecasting",
    "Advanced analytics",
    "AI-powered insight generation",
    "Priority support"
  ];

  // Check if we're in a secure environment for modal checkout
  const canUseModalCheckout = () => {
    // Always use modal checkout with our improved implementation
    return true;
  };

  // Handle Pro plan subscription
  const handleProPlanClick = async () => {
    // Clear any previous errors
    setErrorMessage(null);
    
    // Check if using placeholder IDs
    const priceId = activeTab === 'monthly' 
      ? stripeConfig.prices.pro.month 
      : stripeConfig.prices.pro.year;
    
    if (!priceId || priceId === '' || !stripeConfig.publishableKey || stripeConfig.publishableKey === '') {
      setErrorMessage("Stripe configuration is missing. Please check your environment variables.");
      return;
    }
    
    setIsLoading(true);
    
    const customerData = {
      plan: activeTab === 'monthly' ? 'monthly' : 'yearly',
      user_interface: 'website',
      date: new Date().toISOString()
    };
    
    try {
      // Always use modal checkout
      console.log('Using modal checkout');
      const cleanup = await StripeCheckout.openModalCheckout({
        priceId,
        email: '', // Will be collected in the payment process
        customerData,
        onSuccess: (paymentId: string) => {
          console.log('Payment successful!', paymentId);
          // Redirect to pricing page with success message
          window.location.href = '/';
        },
        onCancel: () => {
          console.log('Payment cancelled');
          setIsLoading(false);
        }
      });
      
      // If cleanup function is returned, register a component unmount handler
      if (typeof cleanup === 'function') {
        return () => {
          cleanup();
          setIsLoading(false);
        };
      }
    } catch (error) {
      console.error('Modal checkout failed:', error);
      setErrorMessage("There was an error processing your payment. Please try again later or contact support.");
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Simple, transparent pricing</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Choose the plan that fits your needs - no hidden fees, cancel anytime.
          </p>
        </div>
        
        {/* Pricing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative inline-flex rounded-full p-1 bg-gray-100 dark:bg-zinc-800">
            <button
              onClick={() => setActiveTab("monthly")}
              className={`relative py-2 px-6 text-sm font-medium transition-all duration-200 rounded-full ${activeTab === "monthly" ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setActiveTab("yearly")}
              className={`relative py-2 px-6 text-sm font-medium transition-all duration-200 rounded-full ${activeTab === "yearly" ? "bg-white dark:bg-zinc-700 shadow-sm" : "text-gray-500 dark:text-gray-400"}`}
            >
              Yearly <span className="text-emerald-600 ml-1">Save 17%</span>
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {errorMessage && (
          <div className="mt-8 max-w-xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="text-red-700">
                {errorMessage}
              </div>
            </div>
          </div>
        )}
        
        {/* Pricing Cards */}
        <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <PricingCard
            title="Free"
            description="Get started with the basics"
            price="$0"
            period="month"
            features={freePlanFeatures}
            buttonText="Current Plan"
            buttonVariant="default"
          />
          
          <PricingCard
            title="Pro"
            description="Everything you need to maximize productivity"
            price={activeTab === "monthly" ? prices.monthly : prices.yearly}
            period={activeTab === "monthly" ? "month" : "year"}
            features={proPlanFeatures}
            buttonText={isLoading ? "Processing..." : "Get Pro"}
            buttonVariant="primary"
            isPopular={true}
            onButtonClick={handleProPlanClick}
          />
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="mx-auto max-w-3xl px-4 mt-20">
        <h3 className="text-2xl font-bold text-center mb-8 dark:text-white">Frequently Asked Questions</h3>
        
        <div className="space-y-0">
          <FAQItem
            question="What happens after my trial ends?"
            answer="When your trial period ends, your account will automatically be downgraded to the free plan. You can upgrade to Pro at any time."
            isOpen={openFAQs["item-1"]}
            toggleOpen={() => toggleFAQ("item-1")}
          />
          
          <FAQItem
            question="Can I cancel my subscription?"
            answer="Yes, you can cancel your subscription at any time. You'll continue to have access to Pro features until the end of your current billing period."
            isOpen={openFAQs["item-2"]}
            toggleOpen={() => toggleFAQ("item-2")}
          />
          
          <FAQItem
            question="Is my payment information secure?"
            answer="Absolutely. We use Stripe, a PCI-compliant payment processor, for all transactions. Your payment information is never stored on our servers."
            isOpen={openFAQs["item-3"]}
            toggleOpen={() => toggleFAQ("item-3")}
          />
        </div>
      </div>
    </div>
  );
}
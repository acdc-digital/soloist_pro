// WEBSITE LANDING PAGE
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/app/page.tsx

'use client'

import React from "react";
import {
  Download,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Pricing from "@/components/Pricing";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { OpenSource } from "@/components/OpenSource";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

// Button component with styling
const Button = ({ children, className, variant = "default" }: ButtonProps) => {
  const baseStyles = "font-medium rounded-full transition-colors px-4 py-2";
  const variantStyles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-200 hover:bg-gray-50"
  };

  return (
    <button className={`${baseStyles} ${variantStyles[variant]} ${className || ""}`}>
      {children}
    </button>
  );
};

type AccordionItemProps = {
  question: string;
  children: React.ReactNode;
}

// Accordion component
const AccordionItem = ({ question, children }: AccordionItemProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="border rounded-lg p-2 bg-white dark:bg-zinc-800 dark:border-zinc-700 mb-4">
      <button
        className="flex justify-between items-center w-full text-left font-medium px-4 py-3 dark:text-white"
        onClick={toggleOpen}
      >
        {question}
        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="px-4 pt-2 pb-4 text-gray-600 dark:text-gray-300">
          {children}
        </div>
      )}
    </div>
  );
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation Bar with Theme Toggle */}
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* Open Source Community Section */}
        <OpenSource />

        {/* Features Section */}
        <section id="features" className="py-16 container mx-auto px-4 mt-8">
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row gap-8 mb-24">
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-2xl font-bold dark:text-white">Your Daily Well-Being at a Glance.</h3>
              <p className="text-gray-600 dark:text-gray-300">
                The color-coded heatmap turns 365 scattered journal entries into one elegant, scrollable canvas. Instantly spot winning streaks, analyze looming slumps, and forecast your mood for tomorrow.
              </p>
              <div className="pt-4">
                <button className="flex items-center gap-2 p-0 font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  Learn more <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
              {/* Feature8 image - temporarily disabled
              <div className="mt-18">
                <img
                  src="/Feature8.png"
                  alt="Daily Well-Being Dashboard"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  width={1024}
                  height={768}
                />
              </div>
              */}
            </div>
            <div className="md:w-1/2 aspect-video w-full">
              <div className="h-full w-full flex items-center justify-center text-gray-400">
                <img
                  src="/Feature1.png"
                  alt="Feature 1 Screenshot"
                  className="w-[85%] h-auto object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  loading="lazy"
                  width={1024}
                  height={768}
                />
              </div>
            </div>
          </div>

          {/* Feature 2 & 3 (Side by side) */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 2 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold dark:text-white">Review the Past, Ready the Future.</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Soloist&apos;s Playground lets you look back to learn—and gear up for what&apos;s coming next.
              </p>
              <div className="pt-4 mb-6">

              </div>
              <div className="aspect-video w-full">
                <div className="h-full w-full flex items-center justify-left text-gray-400">
                  <img
                    src="/Feature3.png"
                    alt="Feature 2 Screenshot"
                    className="w-[95%] h-auto object-contain rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                    loading="lazy"
                    width={1024}
                    height={768}
                  />
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold dark:text-white">See the Patterns. Shape the Progress.</h3>
              <p className="text-gray-600 dark:text-gray-300">
              pinpoint why today felt different, watch real-time charts reveal emerging trends, and tag moments before they fade.
              </p>
              <div className="pt-4 mb-6">

              </div>
              <div className="aspect-video w-full">
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  <img
                    src="/Feature6.png"
                    alt="Feature 3 Screenshot"
                    className="w-[90%] h-auto object-contain rounded-lg transition-shadow"
                    loading="lazy"
                    width={1024}
                    height={768}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        <section id="faq" className="py-16 bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16 dark:text-white">FAQ Section</h2>

            <div className="max-w-3xl mx-auto">
              <AccordionItem question="Is it free to start?">
                Use collapsible questions to address common concerns without overwhelming the page.
              </AccordionItem>
              <AccordionItem question="How long does setup take?">
                Use collapsible questions to address common concerns without overwhelming the page.
              </AccordionItem>
              <AccordionItem question="What devices are supported?">
                Use collapsible questions to address common concerns without overwhelming the page.
              </AccordionItem>
              <AccordionItem question="How do I get help if needed?">
                Use collapsible questions to address common concerns without overwhelming the page.
              </AccordionItem>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold dark:text-white">CTA Heading</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Reinforce the download offer, repeat what matters most to your users, and make it very clear what the next step is.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="h-12 flex items-center gap-2">
                <Download size={18} aria-hidden="true" />
                Download App
              </Button>
              <Button variant="outline" className="h-12 flex items-center gap-2">
                Learn More <ChevronRight size={16} aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-zinc-900 border-t dark:border-zinc-800 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Company Name. All Rights Reserved.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                Instagram
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                Facebook
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
// HERO COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/Hero.tsx

'use client'

import React from "react";
import { Download, ChevronRight } from "lucide-react";

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

export const Hero = () => {
  return (
    <section className="py-12 md:py-24 container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-4 md:w-full">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              #MoodForecasting.
            </p>
            <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-4">
              Track. Reflect. Forecast.
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Soloist turns your everyday thoughts into color-coded insights and automated Forecasts, so you always know where you stand and you can prepare for what&apos;s coming next.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Button className="h-12 flex items-center gap-2">
              <Download size={18} aria-hidden="true" />
              Download App
            </Button>
            <Button variant="outline" className="h-12 flex items-center gap-2">
              Try Online Free <ChevronRight size={16} aria-hidden="true" />
            </Button>
          </div>
          
          <p className="text-sm text-gray-500 pt-4">
            Emotional heatmaps visualize your mood and predict tomorrow&apos;s.
          </p>
        </div>
        
        <div className="md:w-full relative">
          <div className="w-full max-w-xl mx-auto relative p-0 rounded-xl">
            <img 
              src="/Hero-Img.png" 
              alt="Soloist Application" 
              className="w-full h-auto object-contain"
              loading="eager"
              width={1024}
              height={768}
              fetchPriority="high"
            />
          </div>
        </div>
      </div>
    </section>
  );
};


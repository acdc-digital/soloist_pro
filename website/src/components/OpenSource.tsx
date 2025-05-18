// OPEN SOURCE COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/OpenSource.tsx

'use client'

import React from "react";

export const OpenSource = () => {
  return (
    <section className="py-4 border-y bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-12 mb-6">
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 border border-zinc-400 dark:border-zinc-600 p-5 rounded-full shadow-sm mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 dark:text-gray-200">
                <path d="M12 1v6a2 2 0 0 0 2 2h6" />
                <path d="M9 21h6a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L12 4" />
                <path d="M8 17a5 5 0 1 0 0-10" />
                <path d="M5 19a7 7 0 0 1 0-14" />
              </svg>
            </div>
            <p className="font-medium dark:text-white">Open Code</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Fully transparent codebase</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 border border-zinc-400 dark:border-zinc-600 p-5 rounded-full shadow-sm mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 dark:text-gray-200">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <p className="font-medium dark:text-white">Community-Driven</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Shaped by our users</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 border border-zinc-400 dark:border-zinc-600 p-5 rounded-full shadow-sm mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 dark:text-gray-200">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <p className="font-medium dark:text-white">Privacy-Focused</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Your data stays yours</p>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 border border-zinc-400 dark:border-zinc-600 p-5 rounded-full shadow-sm mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800 dark:text-gray-200">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
              </svg>
            </div>
            <p className="font-medium dark:text-white">Transparent Roadmap</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">Openly planned future</p>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="https://github.com/acdc-digital/soloist_pro" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-indigo-700 text-white px-6 py-3 rounded-full hover:bg-indigo-800 transition-colors mb-2 text-base"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            View on GitHub
          </a>
        </div>

        <div>
          <p className="text-center text-xs text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mt-4">
            Soloist is proudly open source, embracing transparency and collaboration.
            We believe in building technology that&apos;s accountable to its users and community.
          </p>
        </div>
      </div>
    </section>
  );
};


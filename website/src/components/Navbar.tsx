// NAVBAR
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/components/Navbar.tsx

"use client"

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api"; // Corrected relative path
import { ThemeToggle } from "./Theme/theme-toggle";
import { AuthModal } from "./AuthModal"; // Import the new modal
import { SignOutWithGitHub } from "@/app/auth/oath/SignOutWithGitHub"; // For direct sign out button

export function Navbar() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Use useQuery with the isAuthenticated query from your convex/auth.ts
  const authState = useQuery(api.auth.isAuthenticated);
  const isLoadingAuth = authState === undefined;
  const isAuthenticated = authState === true;

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // If user is authenticated, clicking the main button could show account details
      // or act as another way to open modal which shows sign out.
      // For now, let's just open the modal which will show the SignOutButton.
      setIsAuthModalOpen(true);
    } else {
      setIsAuthModalOpen(true); // Open modal for login/signup
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4 flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <h2 className="text-1xl md:text-3xl font-bold">Soloist.</h2>
          </div>
          
          <nav className="hidden md:flex space-x-6 text-md">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#pricing" className="hover:text-gray-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-gray-600 transition-colors">FAQs</a>
          </nav>
          
          <div className="flex items-center space-x-3">
            {isLoadingAuth ? (
              <button className="font-medium rounded-full transition-colors px-4 py-2 bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed animate-pulse dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600" disabled>
                Loading...
              </button>
            ) : isAuthenticated ? (
              // If authenticated, show a Sign Out button or an Account button
              // For this example, we'll show a button that opens the modal with Sign Out option
              // Or directly use SignOutWithGitHub here if preferred
              <button 
                onClick={handleAuthAction}
                className="font-medium rounded-full transition-colors px-4 py-2 bg-white text-black hover:bg-gray-100 border border-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600"
              >
                Account
              </button>
            ) : (
              <button 
                onClick={handleAuthAction}
                className="font-medium rounded-full transition-colors px-4 py-2 bg-white text-black hover:bg-gray-100 border border-black dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-600"
              >
                Login / Signup
              </button>
            )}
            <button className="font-medium rounded-full transition-colors px-4 py-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Get App
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
} 
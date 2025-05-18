"use client";

import React from 'react';
import { useQuery } from "convex/react"; // For using Convex queries
import { api } from "../../../convex/_generated/api"; // Using direct relative path
import { SignInWithGitHub } from '@/app/auth/oath/SignInWithGitHub';
import { SignOutWithGitHub } from '@/app/auth/oath/SignOutWithGitHub';
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  // Use useQuery with the isAuthenticated query from your convex/auth.ts
  const authState = useQuery(api.auth.isAuthenticated);
  // isLoading will be true if authState is undefined, isAuthenticated if authState is true
  const isLoading = authState === undefined;
  const isAuthenticated = authState === true;

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-lg bg-background p-8 shadow-xl">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 rounded-full"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            {isAuthenticated ? "Account" : "Welcome"}
          </h2>

          {isLoading && (
            <div className="text-center text-muted-foreground">
              Loading authentication status...
            </div>
          )}

          {!isLoading && !isAuthenticated && (
            <div className="flex flex-col space-y-4">
              <p className="text-center text-muted-foreground">
                Sign in or create an account using GitHub.
              </p>
              <SignInWithGitHub />
            </div>
          )}

          {!isLoading && isAuthenticated && (
            <div className="flex flex-col space-y-4 items-center">
              <p className="text-center text-muted-foreground">
                You are signed in.
              </p>
              <SignOutWithGitHub variant="destructive" className="w-full max-w-xs" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
"use client";
// GITHUB SIGNIN COMPONENT
// /Users/matthewsimon/Documents/Github/soloist_pro/website/src/app/auth/oath/SignInWithGitHub.tsx

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import React, { useEffect } from "react";

export function SignInWithGitHub() {
  const authActions = useAuthActions();
  
  useEffect(() => {
    console.log("SignInWithGitHub: authActions:", authActions);
  }, [authActions]);
  
  const handleSignIn = () => {
    if (authActions && typeof authActions.signIn === 'function') {
      void authActions.signIn("github", { redirectTo: "/" });
    } else {
      console.error("SignInWithGitHub: authActions.signIn is not available or not a function.", authActions);
    }
  };

  return (
    <Button
      className="flex-1"
      variant="outline"
      type="button"
      onClick={handleSignIn}
    >
      <GitHubLogoIcon className="mr-2 h-4 w-4" /> GitHub
    </Button>
  );
}
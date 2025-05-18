// GITHUB SIGNOUT COMPONENT
// /Users/matthewsimon/Documents/Github/electron-nextjs/renderer/src/auth/oath/SignOutWithGitHub.tsx

"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { ExitIcon } from "@radix-ui/react-icons";

type SignOutWithGitHubProps = {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
};

export function SignOutWithGitHub({
  variant = "outline",
  size = "default",
  className = "flex-1",
}: SignOutWithGitHubProps) {
  const authActions = useAuthActions();
  
  const handleSignOut = () => {
    if (authActions && authActions.signOut) {
      try {
        authActions.signOut();
        // Redirect after signOut is initiated. 
        // Note: signOut might be async and involve redirects itself.
        // Depending on @convex-dev/auth behavior, this manual redirect might need adjustment.
        window.location.href = "/"; 
      } catch (error) {
        console.error("Error during sign out:", error);
      }
    } else {
      console.error("authActions or authActions.signOut is not available.");
    }
  };
  
  return (
    <Button
      className={className}
      variant={variant}
      size={size}
      type="button"
      onClick={handleSignOut}
    >
      <ExitIcon className="mr-2 h-4 w-4" /> Sign Out
    </Button>
  );
}
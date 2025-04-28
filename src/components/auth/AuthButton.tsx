
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

export const AuthButton = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Starting GitHub OAuth flow...");
      
      // Use the current page as the redirect URL
      const redirectUrl = window.location.origin;
      console.log("Redirect URL:", redirectUrl);
      
      // Use GitHub OAuth for login with appropriate scopes
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl,
          // Ask for minimal required permissions to avoid permissions errors
          scopes: 'read:user'
        }
      });
      
      if (error) {
        console.error("GitHub Auth error:", error);
        toast.error("Failed to sign in with GitHub. Please try again.");
        throw error;
      }
      
      console.log("OAuth initiated successfully");
      
      // Set a flag to indicate we've initiated OAuth
      sessionStorage.setItem('oauth_initiated', 'true');
    } catch (error) {
      console.error("GitHub sign in error:", error);
      toast.error("Could not sign in with GitHub. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      className="flex items-center gap-2"
      disabled={isLoading}
    >
      <Github className="h-4 w-4" />
      {isLoading ? "Connecting..." : "Sign in with GitHub"}
    </Button>
  );
};

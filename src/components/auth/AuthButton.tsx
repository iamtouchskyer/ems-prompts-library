
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const AuthButton = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      console.log("Starting GitHub OAuth flow...");
      
      // Make sure we're using the current domain for the redirect
      const redirectUrl = `${window.location.origin}/`;
      console.log("Redirect URL:", redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: redirectUrl,
          scopes: 'read:user user:email',
        }
      });
      
      if (error) {
        console.error("GitHub Auth error:", error);
        throw error;
      }
      
      console.log("OAuth response:", data);
      // User will be redirected to GitHub at this point
    } catch (error) {
      console.error("GitHub sign in error:", error);
      setIsLoading(false);
      
      toast({
        title: "GitHub Sign-in Error",
        description: "Could not sign in with GitHub. Please try again later.",
        variant: "destructive"
      });
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
